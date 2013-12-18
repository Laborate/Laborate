var redis = require('redis');

module.exports = function() {
    var client = redis.createClient();
    client.select(config.redis);
    return client;
};
