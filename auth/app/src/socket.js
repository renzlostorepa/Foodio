const Order = require('./models/OrderModel')
const { publisher, store, subscriber } = require('./config/redis/connect')
const io = require('./config/socketio/io')
const { restaurantSocket, customerSocket, riderSocket } = require('./config/socketio/namespace').init(io.getIO())

refreshOrders()

restaurantSocket.on('connection', async (socket) => {
  console.log('CONNECTED WITH ' + socket.id)

  socket.join(socket.username)

  socket.on('orderAccepted', async (order) => {
    publisher
      .publish('orderAccepted', JSON.stringify(order))
      .catch((err) => console.log(err))
  })

  socket.on('orderDeclined', async (order) => {
    const customerUsername = await store
      .hGet('customer_order', order._id)
      .then((user) => {
        return user
      })

    await store.hDel('order', customerUsername)
    await store.hDel('customer_order', order._id)
    customerSocket.to(customerUsername).emit('orderDeclined', 'Order declined')
  })

  socket.on('disconnect', async () => {
    await store.hDel('restaurant', socket.username, socket.id)
  })
})

subscriber.subscribe('order', async (order) => {
  const newOrder = JSON.parse(order)

  await store.hSet('customer_order', newOrder.order._id, newOrder.username)
  await store.hSet('order', newOrder.username, newOrder.order._id)

  customerSocket.to(newOrder.username).emit('pending_order', newOrder.order)

  restaurantSocket.to(newOrder.order.username).emit('order', newOrder.order)
})

customerSocket.on('connection', async (socket) => {
  socket.join(socket.username)

  const orderExists = await store
    .hGet('order', socket.username)
    .then((data) => {
      return data
    })

  if (orderExists) {
    const order = await Order.findOne({ _id: orderExists })

    customerSocket.to(socket.username).emit('pending_order', order)
  }

  socket.on('disconnect', async () => {
    await store.hDel('customer', socket.username, socket.id)
  })
})

subscriber.subscribe('pending_order', (order) => {
  const pendingOrder = JSON.parse(order)

  customerSocket
    .to(pendingOrder.customerName)
    .emit('pending_order', pendingOrder.newOrder)
})

riderSocket.on('connection', async (socket) => {
  const pendingOrder = await store
    .hGet('order_queue', socket.username)
    .then((orderId) => {
      return orderId
    })
  socket.join(socket.username)

  if (pendingOrder) {
    riderSocket.to(socket.username).emit('pendingOrder', pendingOrder)
  } else {
    await store.lPush('riders_queue', socket.username)
  }

  socket.on('disconnect', async () => {
    await store.lRem('riders_queue', 0, socket.username)
  })

  socket.on('riderAcceptedOrder', async () => {
    await store.lRem('riders_queue', 0, socket.username)
  })

  socket.on('refuse', async (order) => {
    await store.hDel('order_queue', socket.username)
    publisher
      .publish('orderAccepted', JSON.stringify(order))
      .catch((err) => console.log(err))
  })

  socket.on('sharelocation', async (obj) => {
    const customerUsername = await store
      .hGet('customer_order', obj.id)
      .then((user) => {
        return user
      })
    customerSocket.to(customerUsername).emit('rider_location', obj.coordinates)
  })

  socket.on('orderCompleted', async (orderId) => {
    const customerUsername = await store
      .hGet('customer_order', orderId)
      .then((user) => {
        return user
      })
    customerSocket.to(customerUsername).emit('orderCompleted')

    await store.hDel('order_queue', socket.username)
    await store.lPush('riders_queue', socket.username)

    await store.hDel('order', customerUsername)
    await store.hDel('customer_order', orderId)
  })
})

subscriber.subscribe('orderAccepted', async (order) => {
  const rider = await store.rPop('riders_queue')

  if (rider != null) {
    riderSocket.to(rider).emit('newOrder', JSON.parse(order))
    await store.lPush('riders_queue', rider)
    await store
      .hSet('order_queue', rider, JSON.parse(order)._id)
      .catch((err) => console.log(err))
  } else {
    setTimeout(() => publisher.publish('orderAccepted', order), 3000)
  }
})

async function refreshOrders () {
  const date = new Date()
  const ttlDate = new Date(date.setHours(date.getHours() - 2))

  await Order.deleteMany({
    time: { $lt: ttlDate },
    state: { $eq: 'pending' }
  }).catch((err) => console.log(err))
}

/* Delete unconfirmed orders every 2 hours */
setInterval(async function () {
  await refreshOrders()
}, 7200000)
