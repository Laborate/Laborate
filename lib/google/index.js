module.exports = function(req, res, next) {
    req.google =  {
        oauth: require('./init').oauth,
        auth_url: require('./init').url,
        get_token: require('./init').token
    }
    next();
}
