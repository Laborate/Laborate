exports.dependencies = function(req, res, next){
    var agent      = req.headers['user-agent'];
    var js_client  = req.app.get("clientJS");
    var css_client = req.app.get("clientCSS");
    var css_path   = req.app.get("root") + 'public/less/';
    var js_path    = req.app.get("root") + 'public/js/';

    /* Core: CSS */
    css_client.addFile("core", css_path + 'core/core.less');
    css_client.addFile("core", css_path + 'core/colors.less');
    css_client.addFile("core", css_path + 'core/form.less');
    css_client.addFile("core", css_path + 'core/notification.less');

    js_client.addFile("core", js_path + 'core/jquery.js');
    js_client.addFile("core", js_path + 'core/core.js');
    js_client.addFile("core", js_path + 'core/center.js');
    js_client.addFile("core", js_path + 'core/cookie.js');
    js_client.addFile("core", js_path + 'core/colors.js');
    js_client.addFile("core", js_path + 'core/notification.js');
    js_client.addFile("core", js_path + 'core/download.js');


    /* Backdrop */
    css_client.addFile("backdrop", css_path + 'backdrop/backdrop.less');
    css_client.addFile("backdrop", css_path + 'backdrop/backdrop.less');
    css_client.addFile("backdrop", css_path + 'backdrop/backdrop.less');

    js_client.addFile("backdrop", js_path + 'backdrop/backdrop.js');

    if(['', 'login', 'register'].indexOf(req.path.replace(/\//g, "")) >= 0) {
        js_client.addFile("backdrop", js_path + 'backdrop/backdropUser.js');
    } else {
        js_client.addFile("backdrop", js_path + 'backdrop/backdropEditor.js');
    }

    next();
};