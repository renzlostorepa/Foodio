const { Router } = require('express')
const { UserCheck } = require('../middleware/UserCheck')
const ShopController = require('../controllers/ShopController')

const router = new Router()

router.get('/', (req, res, next) => {
  /*
        #swagger.tags = ['Shops']
        #swagger.responses[200] = {
        schema: { "$ref": "#/definitions/ShopArrayMock" }
        }
        */
  ShopController.getAllShops(req, res, next)
})

router.get('/:username', (req, res, next) => {
  /*
    #swagger.tags = ['Shops']
    #swagger.responses[200] = {
    schema: { "$ref": "#/definitions/ShopMock" }
    }
      */
  ShopController.findShopByUsername(req, res, next)
})

router.put('/:username', UserCheck, (req, res, next) => {
  /*
  #swagger.tags = ['Shops']
    #swagger.parameters[obj] = {
    in: 'body',
    schema: { working: { type: boolean }}
    }
    #swagger.responses[200] = {
  schema: { "$ref": "#/definitions/UserMock" }
  }
  */
  ShopController.findShopByUsernameAndUpdate(req, res, next)
})

module.exports = router
