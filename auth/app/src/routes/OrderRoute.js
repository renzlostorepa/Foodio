const { Router } = require('express')
const OrderController = require('../controllers/OrderController')

const router = Router()

router.post('/', (req, res, next) => {
  /*
        #swagger.tags = ['Orders']
        #swagger.parameters[obj] = {
        in: 'body',
        schema: { "$ref": "#/definitions/OrderMock" }
        }
          #swagger.responses[200] = {
        schema: { "$ref": "#/definitions/OrderResponseMock" }
        }
      */
  OrderController.createOrder(req, res, next)
})

router.get('/', (req, res, next) => {
  /*
        #swagger.tags = ['Orders']
           #swagger.responses[200] = {
        schema: { "$ref": "#/definitions/OrderResponseMock" }
        }

       */
  OrderController.findOrderById(req, res, next)
})

router.get('/:username', (req, res, next) => {
  /*
        #swagger.tags = ['Orders']

        #swagger.responses[200] = {
        schema: { "$ref": "#/definitions/OrderResponseMock" }
        }

       */
  OrderController.findOrderByUsername(req, res, next)
})

router.put('/:id', (req, res, next) => {
  /*
      #swagger.tags = ['Orders']
        #swagger.parameters[obj] = {
        in: 'body',
        schema: { "$ref": "#/definitions/OrderMock" }
        }
    #swagger.responses[200] = {
        schema: { "$ref": "#/definitions/OrderResponseMock" }
        }

      */
  OrderController.findOrderByIdAndUpdate(req, res, next)
})

router.delete('/:id', (req, res, next) => {
  /*  #swagger.tags = ['Orders']
         #swagger.responses[200] = {
      schema: { "$ref": "#/definitions/OrderResponseMock" }
      }
  */
  OrderController.deleteById(req, res, next)
})

module.exports = router
