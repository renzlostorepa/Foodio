require('dotenv').config({ path: '../.env' }) // load .env variables
const mongoose = require('mongoose') // import fresh mongoose object
const { log } = require('mercedlogger') // import merced logger
const { mode } = process.env
// DESTRUCTURE ENV VARIABLES
const DATABASE_URL = mode === 'dev' ? process.env.DATABASE_URL_DEV : process.env.DATABASE_URL_TEST

// CONNECT TO MONGO
mongoose.connect = mongoose.connect(DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// CONNECTION EVENTS
mongoose.connection
  .on('open', () => log.green('DATABASE STATE', 'Connection Open'))
  .on('close', () => log.magenta('DATABASE STATE', 'Connection Open'))
  .on('error', (error) => log.red('DATABASE STATE', error))

// EXPORT CONNECTION
module.exports = mongoose
