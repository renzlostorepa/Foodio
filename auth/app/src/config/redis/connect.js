const redis = require('redis')
const config = { url: 'redis://redis:6379' }

const subscriber = redis.createClient(config)
const publisher = redis.createClient(config)
const store = redis.createClient(config)

subscriber.connect().catch(err => console.log(err))
publisher.connect().catch(err => console.log(err))
store.connect().catch(err => console.log(err))

module.exports = { subscriber, publisher, store }
