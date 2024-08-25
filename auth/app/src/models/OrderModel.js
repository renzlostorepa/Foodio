const { Schema, model } = require('../config/db/connection')
const mongoose = require('mongoose')

const Menu = mongoose.Schema({
  categoryName: Schema.Types.String,
  elements: [
    mongoose.Schema({
      name: Schema.Types.String,
      price: Schema.Types.String
    })
  ]
})

const Coordinate = new Schema({
  _latitude: { type: Number, default: 0 },
  _longitude: { type: Number, default: 0 }
})

const OrderSchema = new Schema({
  username: {
    type: Schema.Types.String,
    ref: 'User',
    required: true
  },
  time: { type: Date, default: Date.now, required: true },
  state: {
    type: String,
    enum: ['accepted', 'pending'],
    default: 'pending',
    required: true
  },
  bill: { type: Number, required: true },
  order: [Menu],
  customerPosition: Coordinate,
  restaurantPosition: Coordinate
}, { versionKey: false })

const Order = model('Order', OrderSchema)

module.exports = Order
