const User = require('../models/UserModel')
const Order = require('../models/OrderModel')
const { publisher } = require('../config/redis/connect')

exports.createOrder = async (req, res, next) => {
  await User.findOne({ restaurant_name: req.body.restaurant_name })
    .select('username')
    .then(async (result) => {
      const order = {
        username: result.username,
        order: req.body.order,
        bill: req.body.bill,
        customerPosition: req.body.customerPosition
      }

      const newOrder = await Order.create(order).catch((err) => next(err))
      const customer = req.username

      publisher
        .publish(
          'order',
          JSON.stringify({ order: newOrder, username: customer })
        )
        .catch((err) => next(err))
      res.sendStatus(200)
    })
    .catch((err) => next(err))
}

exports.findOrderById = async (req, res, next) => {
  await Order.find({ _id: req.query.id })
    .then((order) => res.send(order))
    .catch((err) => next(err))
}

exports.findOrderByUsername = async (req, res, next) => {
  await Order.find({ username: { $eq: req.params.username } })
    .sort({ time: 'descending' })
    .then((orders) => res.json(orders))
    .catch((err) => next(err))
}

exports.findOrderByIdAndUpdate = async (req, res, next) => {
  await Order.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
    .then((result) => res.send(result))
    .catch((err) => next(err))
}

exports.deleteById = async (req, res, next) => {
  await Order.findByIdAndRemove(req.params.id)
    .then((result) => res.send(result))
    .catch((err) => next(err))
}
