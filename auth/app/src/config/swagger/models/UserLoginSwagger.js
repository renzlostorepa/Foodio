const { Schema, model } = require('mongoose')

const UserLoginSchema = new Schema({
  role: {
    type: String,
    enum: ['CLIENTE', 'RISTORATORE', 'RIDER'],
    required: true
  },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
}, { _id: false })

const UserLoginSwagger = model('UserLogin', UserLoginSchema)

module.exports = UserLoginSwagger
