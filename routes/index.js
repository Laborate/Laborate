var core = require('./core');
var auth = require('./auth');

module.exports = function(app){
    /* Root Route */
    app.get('/', auth.loginCheck, core.login);

    /* Login */
    app.get('/login', auth.loginCheck, core.login);
    app.post('/auth/login', auth.login);

    /* Register */
    app.get('/register', auth.loginCheck, core.register);
    app.post('/auth/register', auth.register);
    app.post('/auth/email_check', auth.emailCheck);

    /* Logout */
    app.get('/logout', auth.logout);

    /* Documents */
    app.get('/documents', auth.restrictAccess, core.documents);
}