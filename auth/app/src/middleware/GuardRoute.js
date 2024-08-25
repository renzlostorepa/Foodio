const jwt = require('jsonwebtoken') // import jwt to sign tokens
const { SECRET = 'secret' } = process.env

exports.Guard = (req, res, next) => {
  const header = req.headers.authorization

  if (typeof header !== 'undefined') {
    const token = req.get('Authorization')

    jwt.verify(token, SECRET, (err, data) => {
      if (err) {
        res.sendStatus(401)
      } else {
        req.token = token
        req.username = jwt.decode(token, SECRET).username
        next()
      }
    })
  } else {
    // If header is undefined return Forbidden (403)
    res.sendStatus(403)
  }
}
