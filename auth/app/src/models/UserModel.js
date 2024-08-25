const { Schema, model } = require('../config/db/connection')
const mongoose = require('mongoose') // import Schema & model

const Coordinate = new Schema({
  type: {
    type: String,
    enum: ['Point']
  },
  coordinates: {
    type: [Number]
  }
})

const Menu = mongoose.Schema({
  category: Schema.Types.String,
  elements: [
    mongoose.Schema({
      name: Schema.Types.String,
      price: Schema.Types.Number
    })
  ]
})

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
  working: { type: Schema.Types.Boolean }
}, { versionKey: false })

const User = model('User', UserSchema)

module.exports = User
