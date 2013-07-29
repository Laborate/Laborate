/* Modules: NPM */
var github = require('octonode');

module.exports = github.auth.config({
    id: config.github.id,
    secret: config.github.secret
}).login(config.github.scope);
