module.exports = function(req, res, next) {
    req.bitbucket = {
        oauth: require("./init").oauth,
        authorize: require("./init").authorize,
        auth_url: require("./init").url,
        get_token: require("./init").token,
        repos: require("./repos"),
        contents: require("./contents")
    }
    next();
}
