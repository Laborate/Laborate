module.exports = {
    auth_url: require("./init").url,
    get_token: require("./init").token,
    commit: require("./commit"),
    repos: require("./repos"),
    contents: require("./contents"),
}
