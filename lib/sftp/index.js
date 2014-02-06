module.exports = {
    type: require("./core").type,
    authorize: require("./init").authorize,
    finish: require("./init").finish,
    contents: require("./contents"),
    save: require("./save")
}
