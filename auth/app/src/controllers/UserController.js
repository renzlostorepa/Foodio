const bcrypt = require('bcryptjs')
const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')

const { SECRET = 'secret' } = process.env

exports.signup = async (req, res, next) => {
  try {
    req.body.user.password = await bcrypt.hash(req.body.user.password, 10)

    await User.create(req.body.user)
      .then(async () => {
        res.send(`User ${req.body.user.username} successfully Registered`)
      })
      .catch((err) => next(err))
  } catch (error) {
    res.status(400).json({ error })
  }
}

exports.login = async (req, res) => {
  try {
    // check if user exists
    const user = await User.findOne({ username: req.body.username })

    if (user) {
      // check if password matches
      const role = req.body.role === user.role
      if (role) {
        const result = await bcrypt
          .compare(req.body.password, user.password)
          .catch((err) => console.log(err))

        if (result) {
          // sign token and send it in response

          await jwt.sign(
            { username: user.username, role: user.role },
            SECRET,
            { expiresIn: '1h' },
            (err, token) => {
              err ? res.status(400) : res.json({ token })
            }
          )
        } else {
          res.status(400).json({ error: "Password doesn't match" })
        }
      } else {
        res
          .status(400)
          .json({ error: `User not exists for ${req.body.role} role` })
      }
    } else {
      res.status(400).json({ error: "UserController doesn't exist" })
    }
  } catch (error) {
    res.status(400).json({ error })
  }
}

exports.findByUsername = async (req, res, next) => {
  await User.findOne({ username: req.params.username })
    .select('-password')
    .then((user) => res.send(user))
    .catch((err) => next(err))
}

exports.findByUsernameAndUpdate = async (req, res, next) => {
  await User.findOneAndUpdate({ username: req.params.username }, req.body)
    .then((result) => {
      res.send(result)
    })
    .catch((err) => next(err))
}
