module.exports = {
    oauth: require("./init").oauth,
    auth_url: require("./init").url,
    get_token: require("./init").token,
    authorize: require("./init").authorize,
    repos: require("./repos"),
    contents: require("./contents")
}
