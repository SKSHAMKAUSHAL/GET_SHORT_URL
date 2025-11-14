const redis = require('redis');
const client = redis.createClient({ url: process.env.REDIS_URL });

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect()
  .then(() => console.log('Redis connected'))
  .catch((err) => console.log('Redis connection failed:', err));

module.exports = client;
