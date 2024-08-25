const { Router } = require('express')
const UserController = require('../controllers/UserController')

const router = Router()

/* Signup route to create a new user */
router.post('/signup', (req, res, next) => {
  /*
                  #swagger.tags = ['Users']
                  #swagger.parameters[obj] = {
                    in: 'body',
                    schema: { "$ref": "#/definitions/User" }
                    }
                  #swagger.responses[200] = {
                    schema: "User {username} Successfully Registered"
                }
                            */
  UserController.signup(req, res, next)
})

/* Login route to verify a user and return a token */
router.post('/login', (req, res) => {
  /*
                  #swagger.tags = ['Users']
                  #swagger.parameters[obj] = {
                    in: 'body',
                    schema: { "$ref": "#/definitions/UserLogin" }
                    }
                         #swagger.responses[200] = {
                    schema: { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imd1cyIsImlhdCI6MTY5NzEzNTU4NiwiZXhwIjoxNjk3MTM5MTg2fQ.zGuptjBu0pNYqxkvmu_TFXRwtt63yqzPv3fuLyC72AE" }
                    }
                */
  UserController.login(req, res)
})

/* Get User Info */
router.get('/:username', (req, res, next) => {
  /*
                    #swagger.tags = ['Users']
                    #swagger.responses[200] = {
                    schema: { "$ref": "#/definitions/UserMock" }
                  }
                */
  UserController.findByUsername(req, res, next)
})

/* Update User Info */
router.put('/:username', async (req, res, next) => {
  /*
                #swagger.tags = ['Users']
                #swagger.parameters[obj] = {
                in: 'body',
                schema: { "$ref": "#/definitions/User" }
            }
                #swagger.responses[200] = {
                schema: { "$ref": "#/definitions/UserMock" }
                }
                */
  UserController.findByUsernameAndUpdate(req, res, next)
})

module.exports = router
