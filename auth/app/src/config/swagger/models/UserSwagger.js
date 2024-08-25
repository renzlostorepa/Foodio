const { Schema, model } = require('mongoose')

const Coordinate = new Schema({
  type: {
    type: String,
    enum: ['Point']
  },
  coordinates: {
    type: [Number]
  }
}, { _id: false })

const Menu = new Schema({
  category: String,
  elements: [
    new Schema({
      name: String,
      price: Number
    }, { _id: false })
  ]
}, { _id: false })

const UserSchema = new Schema({
  role: {
    type: String,
    enum: ['CLIENTE', 'RISTORATORE', 'RIDER'],
    required: true
  },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  restaurant_name: { type: String },
  menu: [Menu],
  credit: { type: Number, default: 100 },
  geolocation: { type: Coordinate, index: '2dsphere' },
  working: { type: Boolean }
}, { _id: false })

const User = model('User', UserSchema)

module.exports = User
