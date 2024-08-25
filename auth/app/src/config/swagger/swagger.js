const swaggerAutogen = require('swagger-autogen')()
const m2s = require('mongoose-to-swagger')
const User = require('./models/UserSwagger')
const UserLogin = require('./models/UserLoginSwagger')
const UserMock = require('./models/UserMock')
const ShopMock = require('./models/ShopMock')
const ShopArrayMock = require('./models/ShopsArrayMock')
const OrderMock = require('./models/OrderMock')
const OrderResponseMock = require('./models/OrderResponseMock')

const doc = {
  info: {
    title: 'Delivery App',
    description: 'REST API'
  },
  host: 'localhost:4000',
  schemes: ['http'],
  definitions: {
    User: m2s(User),
    UserLogin: m2s(UserLogin),
    UserMock,
    ShopMock,
    ShopArrayMock,
    OrderResponseMock,
    OrderMock: m2s(OrderMock)
  }
}

const outputFile = './swagger.yaml'
const endpointsFiles = ['../../server.js']

swaggerAutogen(outputFile, endpointsFiles, doc)
