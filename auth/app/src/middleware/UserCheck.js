const jwt = require('jsonwebtoken') // import jwt to sign tokens
const { SECRET = 'secret' } = process.env

exports.UserCheck = (req, res, next) => {
  const header = req.headers.authorization
  const check = req.params.username
  if (typeof header !== 'undefined') {
    const token = req.get('Authorization')
    if (check.toLowerCase() === jwt.decode(token, SECRET).username) {
      next()
    } else {
      res.sendStatus(403)
    }
  } else {
    // If header is undefined return Forbidden (403)
    res.sendStatus(403)
  }
}
