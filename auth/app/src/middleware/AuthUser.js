const jwt = require('jsonwebtoken')
const { SECRET = 'secret' } = process.env

exports.AuthUser = (socket, next) => {
  const token = socket.handshake.auth.token
  if (token) {
    jwt.verify(token, SECRET, (err, data) => {
      if (err) {
        next(err)
      } else {
        socket.username = jwt.decode(token, SECRET).username
        next()
      }
    })
  }
}
