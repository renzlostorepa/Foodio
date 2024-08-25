const { Schema, model } = require('mongoose')

const Menu = new Schema({
  categoryName: String,
  elements: [
    new Schema({
      name: String,
      price: String
    })
  ]
}, { _id: false })

const Coordinate = new Schema({
  type: {
    type: String,
    enum: ['Point']
  },
  coordinates: {
    type: [Number]
  }
}, { _id: false })

const Order = new Schema({
  restaurant_name: { type: String },
  order: [Menu],
  bill: { type: Number },
  customerPosition: { type: Coordinate }
}, { _id: false })

const OrderMock = model('OrderMock', Order)

module.exports = OrderMock
