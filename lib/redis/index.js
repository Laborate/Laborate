var redis = require('redis');

module.exports = function() {
    var client = redis.createClient();
    return client;
};
