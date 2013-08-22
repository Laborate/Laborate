module.exports = function(req, res, next) {
    req.github = {
        auth_url: require("./url"),
        get_token: require("./token"),
        commit: require("./commit"),
        repos: require("./repos"),
        contents: require("./contents"),
    }
    next();
}
