exports.dependencies = function(req, res, next){
    var agent      = req.headers['user-agent'];
    var js_client  = req.app.get("clientJS");
    var css_client = req.app.get("clientCSS");
    var css_path   = req.app.get("root") + 'public/less/';
    var js_path    = req.app.get("root") + 'public/js/';
    var codemirror_path    = req.app.get("root") + 'codemirror/';

    /* Core */
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

    /* Icons */
    css_client.addFile("icons", css_path + 'core/icons.less');

    /* Header */
    css_client.addFile("header", css_path + 'core/header.less');
    js_client.addFile("header", js_path + 'core/header.js');

    /* Chat Room */
    css_client.addFile("chat_room", css_path + 'editor/chatRoom.less');
    js_client.addFile("chat_room", js_path + 'editor/chatRoom.js');

    /* jScroll */
    css_client.addFile("jscroll", css_path + 'core/jscrollpane.less');
    js_client.addFile("jscroll", js_path + 'core/jscrollpane.js');
    js_client.addFile("jscroll", js_path + 'core/mousewheel.js');

    /* CodeMirror */
    css_client.addFile("codemirror", codemirror_path + 'lib/codemirror.css');
    css_client.addFile("codemirror", codemirror_path + 'theme/codelaborate.css');
    js_client.addFile("codemirror", codemirror_path + 'lib/codemirror.js');
    js_client.addFile("codemirror", codemirror_path + 'addon/mode/loadmode.js');
    js_client.addFile("codemirror", js_path + 'editor/modes.js');

    /* Print Mode */
    css_client.addFile("print_mode", css_path + 'editor/print.less');
    js_client.addFile("print_mode", js_path + 'editor/print.js');

    /* Editor */
    css_client.addFile("editor", css_path + 'editor/editor.less');
    css_client.addFile("editor", css_path + 'core/colors.less');
    css_client.addFile("editor", codemirror_path + 'addon/dialog/dialog.css');
    js_client.addFile("editor", js_path + 'editor/editorInit.js');
    js_client.addFile("editor", js_path + 'editor/editor.js');
    js_client.addFile("editor", js_path + 'editor/sidebar.js');
    js_client.addFile("editor", js_path + 'editor/sidebarUtil.js');
    js_client.addFile("editor", js_path + 'lib/codemirror.js');
    js_client.addFile("editor", js_path + 'addon/search/match-highlighter.js');
    js_client.addFile("editor", js_path + 'addon/search/search.js');
    js_client.addFile("editor", js_path + 'addon/search/searchcursor.js');
    js_client.addFile("editor", js_path + 'addon/edit/matchbrackets.js');
    js_client.addFile("editor", js_path + 'addon/selection/active-line.js');
    js_client.addFile("editor", js_path + 'addon/edit/closebrackets.js');
    js_client.addFile("editor", js_path + 'addon/edit/closetag.js');
    js_client.addFile("editor", js_path + 'addon/mode/overlay.js');
    js_client.addFile("editor", js_path + 'addon/dialog/dialog.js');
    js_client.addFile("editor", js_path + 'addon/display/placeholder.js');
    js_client.addFile("editor", js_path + 'keymap/vim.js');
    js_client.addFile("editor", js_path + 'keymap/emacs.js');

    /* Documents */
    css_client.addFile("documents", css_path + 'documents/documents.less');
    js_client.addFile("documents", js_path + 'documents/documents.js');
    js_client.addFile("documents", js_path + 'documents/documentsInit.js');
    js_client.addFile("documents", js_path + 'documents/documentsUtil.js');

    /* Account */
    css_client.addFile("account", css_path + 'account/account.less');
    js_client.addFile("account", js_path + 'account/account.js');
    js_client.addFile("account", js_path + 'account/accountInit.js');
    js_client.addFile("account", js_path + 'account/accountUtil.js');

    next();
};