const User = require('../models/UserModel')

const MAX_DISTANCE = 5000

exports.getAllShops = async (req, res, next) => {
  const { lat, lon } = req.query

  await User.find({
    geolocation: {
      $near: {
        $geometry: { type: 'Point', coordinates: [lon, lat] },
        $maxDistance: MAX_DISTANCE
      }
    }
  })
    .where('role')
    .equals('RISTORATORE')
    .where('working')
    .equals(true)
    .select('menu restaurant_name working geolocation')
    .then((result) => res.json(result))
    .catch((err) => next(err))
}

exports.findShopByUsername = async (req, res, next) => {
  await User.findOne({ username: req.params.username, role: 'RISTORATORE' })
    .select('menu restaurant_name working')
    .then((result) => res.json(result))
    .catch((err) => next(err))
}

exports.findShopByUsernameAndUpdate = async (req, res, next) => {
  await User.findOneAndUpdate(
    { username: req.params.username, role: 'RISTORATORE' },
    { $set: req.body })
    .select('-password')
    .then((result) => res.json(result))
    .catch((err) => next(err))
}
