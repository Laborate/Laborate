var redis = require('redis');
var client = redis.createClient();
client.select(config.redis);

module.exports = client;
