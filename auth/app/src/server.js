require('dotenv').config({ path: '.env' })
const express = require('express')
const morgan = require('morgan')
const { log } = require('mercedlogger')
const cors = require('cors')
const UserRouter = require('./routes/UserRoute')
const OrderRouter = require('./routes/OrderRoute')
const ShopRouter = require('./routes/ShopRoute')
const { Guard } = require('./middleware/GuardRoute')
const { createServer } = require('http')
const { mode } = process.env
const swaggerUi = require('swagger-ui-express')
const fs = require('fs')
const YAML = require('yaml')
// DESTRUCTURE ENV VARIABLES
const PORT = mode === 'dev' ? process.env.PORT_DEV : process.env.PORT_TEST

const app = express()
const httpServer = createServer(app)

app.use(cors()) // add cors headers
app.use(morgan('tiny')) // log the request for debugging
app.use(express.json()) // parse json bodies

/* Swagger */
const file = fs.readFileSync('./config/swagger/swagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use('/users', UserRouter)

app.use('/orders', Guard, OrderRouter)

app.use('/shops', Guard, ShopRouter)

httpServer.listen(PORT, () =>
  log.green('SERVER STATUS', `Listening on port ${PORT}`)
)

console.log(mode)

const io = require('./config/socketio/io')

io.init(httpServer, {
  cors: {
    origin: '*'
  }
})

if (mode === 'dev') {
  require('./socket')
}

module.exports = { httpServer }
