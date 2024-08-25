const { AuthUser } = require('../../middleware/AuthUser')

let restaurantSocket, customerSocket, riderSocket

module.exports = {
  init: (io) => {
    restaurantSocket = io.of('/restaurant').use(AuthUser)
    customerSocket = io.of('/customer').use(AuthUser)
    riderSocket = io.of('/rider').use(AuthUser)

    return { restaurantSocket, customerSocket, riderSocket }
  },
  get: () => {
    if (!restaurantSocket || !customerSocket || !riderSocket) {
      throw new Error("Can't get namespaces instance before calling .init()")
    }
    return { restaurantSocket, customerSocket, riderSocket }
  }
}
