module.exports = function(req, res, next) {
    req.bitbucket = {
        auth_url: require("./init").url,
        get_token: require("./init").token
    }
    next();
}
