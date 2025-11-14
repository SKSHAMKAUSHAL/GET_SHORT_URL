const redis = require('redis');
require('dotenv').config();

const client = redis.createClient({ url: process.env.REDIS_URL });

client.on('error', (err) => console.error('❌ Redis Client Error:', err));

async function flushRedis() {
  try {
    await client.connect();
    await client.flushAll();
    console.log('All Redis data flushed successfully!');
  } catch (err) {
    console.error('Error flushing Redis:', err);
  } finally {
    await client.quit();
  }
}

flushRedis();
