module.exports = {
    oauth: require('./init').oauth,
    auth_url: require('./init').url,
    get_token: require('./init').token,
    refresh_token: require('./init').refresh,
    authorize: require('./init').authorize,
    contents: require('./contents')
}
