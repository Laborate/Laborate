exports.index = function(req, res) {
    res.render('account', {
        title: 'Account',
        navigation: 'User Settings',
        mode: "account",
        user: req.session.user,
        github_auth_url: req.github.auth_url,
        js: clientJS.renderTags("account", "header"),
        css: clientCSS.renderTags("account", "header"),
    });
};
