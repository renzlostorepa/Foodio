require('dotenv').config({ path: '../config/.env' })
const { httpServer } = require('../../server')
const mongoose = require('mongoose')
const { PORT_TEST, SECRET } = process.env
const axios = require('axios')
const jwt = require('jsonwebtoken')
const BASE_URL = `http://localhost:${PORT_TEST}`
const USER_URL = BASE_URL + '/users'
const ORDER_URL = BASE_URL + '/orders'
const crypto = require('crypto')
const { publisher, store, subscriber } = require('../../config/redis/connect')

const ristoratore = {
  role: 'RISTORATORE',
  username: 'errico',
  password: 'e'
}

const user = {
  role: 'RISTORATORE',
  username: crypto.randomBytes(20).toString('hex'),
  password: 'hector',
  credit: 100,
  restaurant_name: 'Los Pollos',
  geolocation: {
    type: 'Point',
    coordinates: [14.773306, 40.748343]
  },
  menu: []
}

const postOrder = {
  _id: new mongoose.Types.ObjectId(),
  restaurant_name: 'errico porzio',
  order: [
    {
      categoryName: 'Dolce',
      elements: [
        {
          name: ' Tiramisù',
          price: '€ 1',
          _id: new mongoose.Types.ObjectId()
        }
      ],
      _id: new mongoose.Types.ObjectId()
    }
  ],
  bill: 1,
  customerPosition: {
    _latitude: Math.random(),
    _longitude: Math.random()
  }
}

const putOrder = {
  bill: 11
}

let token

beforeAll(async () => {
  token = await jwt.sign({ username: ristoratore.username }, SECRET, {
    expiresIn: '1h'
  })
})

describe('User Controller', () => {
  test('POST SIGNUP', async () => {
    await axios.post(`${USER_URL}/signup`, { user }).then(response => {
      expect(response.data).toBe(`User ${user.username} successfully Registered`)
      expect(response.status).toBe(200)
    })
  })

  test('POST /login', async () => {
    await axios.post(`${USER_URL}/login`, {
      role: user.role,
      username: user.username,
      password: user.password
    }).then(response => {
      expect(response.data).toHaveProperty('token')
    })
  })

  test('GET userInfo', async () => {
    await axios.get(`${USER_URL}/${user.username}`, {
      headers: { Authorization: token }
    }).then(response => {
      expect(response.status).toBe(200)
    })
  })
})

describe('Order Controller', () => {
  test('GET ORDERS', async () => {
    await axios.get(ORDER_URL, {
      headers: { Authorization: token }
    }).then(response => {
      expect(response.status).toBe(200)
    })
  })

  test('PUT ORDER', async () => {
    await axios.put(`${ORDER_URL}/${postOrder._id}`, putOrder, {
      headers: { Authorization: token }
    }).then(response => {
      expect(response.status).toBe(200)
    })
  })

  test('DELETE ORDER', async () => {
    await axios.delete(`${ORDER_URL}/${postOrder._id}`, {
      headers: { Authorization: token }
    }).then(response => {
      expect(response.status).toBe(200)
    })
  })

  afterAll(async () => {
    await mongoose.connection.db.dropDatabase()
    await mongoose.connection.close()
    await httpServer.close()
    await publisher.disconnect()
    await store.disconnect()
    await subscriber.disconnect()
  })
})
