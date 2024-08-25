const { Server } = require('socket.io')

let io

module.exports = {
  init: function (server, cors) {
    io = new Server(server, cors)
    return io
  },
  getIO: function () {
    if (!io) {
      throw new Error("Can't get io instance before calling .init()")
    }
    return io
  }
}
