var redis = require('redis');
var redisClient = redis.createClient();

redisClient.keys("editor*", function(error, documents) {

});
