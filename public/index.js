module.exports = function(root) {
    var css_path   = __dirname + '/less/';
    var js_path    = __dirname + '/js/';
    var node_modules = root + '/node_modules/';
    var codemirror_path = node_modules + 'codemirror/';

    /* Core */
    clientCSS.addFile(css_path + 'core/core.less');
    clientCSS.addFile(css_path + 'core/icons.less');
    clientCSS.addFile(css_path + 'core/popup.less');
    clientCSS.addFile(css_path + 'core/contextmenu.less');
    clientCSS.addFile(css_path + 'core/sidebar.less');
    clientCSS.addFile(css_path + 'core/header.less');
    clientCSS.addFile(css_path + 'core/jscroll.less');

    clientJS.addUrl('https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js');
    clientJS.addUrl('https://d3nslu0hdya83q.cloudfront.net/dist/1.0/raven.min.js');
    clientJS.addUrl('/socket.io/socket.io.js');

    clientJS.addFile(js_path + 'core/jscrollpane.js');
    clientJS.addFile(js_path + 'core/mousewheel.js');
    clientJS.addFile(js_path + 'core/center.js');
    clientJS.addFile(js_path + 'core/colors.js');
    clientJS.addFile(js_path + 'core/cookie.js');
    clientJS.addFile(js_path + 'core/core.js');

    clientJS.addExec(lib.core.extensions);

    /* EDT Debugger */
    clientJS.addFile(root + '/lib/debugger/edt.js');

    /* Landing */
    clientCSS.addFile("landing", css_path + 'landing/index.less');
    clientJS.addFile("landing", js_path + 'landing/index.js');

    /* Explore */
    clientCSS.addFile("explore", css_path + 'explore/index.less');
    clientJS.addFile("explore", js_path + 'explore/index.js');

    /* Backdrop */
    clientCSS.addFile("backdrop", css_path + 'backdrop/backdrop.less');
    clientCSS.addFile("backdrop", css_path + 'backdrop/loader.less');
    clientJS.addFile("backdrop", js_path + 'backdrop/backdrop.js');

    /* Download */
    clientJS.addFile("download", js_path + 'core/download.js');

    /* Crypto */
    clientJS.addFile("crypto", node_modules + 'node-cryptojs-aes/client/aes.js');

    /* Async */
    clientJS.addFile("aysnc", node_modules + 'async/lib/async.js');

    /* Copy */
    clientJS.addFile("copy", js_path + 'core/copy.js');

    /* CodeMirror */
    clientCSS.addFile("codemirror", codemirror_path + 'lib/codemirror.css');
    clientCSS.addFile("codemirror", css_path + 'editor/laborate.less');

    clientJS.addFile("codemirror", codemirror_path + 'lib/codemirror.js');
    clientJS.addFile("codemirror", codemirror_path + 'addon/mode/loadmode.js');
    clientJS.addFile("codemirror", codemirror_path + 'addon/display/placeholder.js');
    clientJS.addFile("codemirror", codemirror_path + 'mode/meta.js');
    clientJS.addFile("codemirror", js_path + 'editor/modes.js');

    /* Editor */
    clientCSS.addFile("editor", css_path + 'editor/editor.less');

    clientCSS.addFile("editor", codemirror_path + 'addon/dialog/dialog.css');

    clientJS.addFile("editor", codemirror_path + 'addon/search/match-highlighter.js');
    clientJS.addFile("editor", codemirror_path + 'addon/search/search.js');
    clientJS.addFile("editor", codemirror_path + 'addon/search/searchcursor.js');
    clientJS.addFile("editor", codemirror_path + 'addon/edit/matchbrackets.js');
    clientJS.addFile("editor", codemirror_path + 'addon/selection/active-line.js');
    clientJS.addFile("editor", codemirror_path + 'addon/edit/closebrackets.js');
    clientJS.addFile("editor", codemirror_path + 'addon/edit/closetag.js');
    clientJS.addFile("editor", codemirror_path + 'addon/edit/matchtags.js');
    clientJS.addFile("editor", codemirror_path + 'addon/fold/xml-fold.js');
    clientJS.addFile("editor", codemirror_path + 'addon/mode/overlay.js');
    clientJS.addFile("editor", codemirror_path + 'addon/dialog/dialog.js');
    clientJS.addFile("editor", codemirror_path + 'keymap/vim.js');
    clientJS.addFile("editor", codemirror_path + 'keymap/emacs.js');

    clientJS.addOb({
        file_size: require(root + "/lib/core/file_size")
    });

    clientJS.addFile("editor", js_path + 'editor/editor.js');
    clientJS.addFile("editor", js_path + 'editor/editorUtil.js');
    clientJS.addFile("editor", js_path + 'editor/editorInit.js');
    clientJS.addFile("editor", js_path + 'editor/sidebar.js');
    clientJS.addFile("editor", js_path + 'editor/sidebarInit.js');
    clientJS.addFile("editor", js_path + 'editor/sidebarUtil.js');
    clientJS.addFile("editor", js_path + 'editor/chatRoom.js');

    /* Documents */
    clientCSS.addFile("documents", css_path + 'documents/documents.less');

    clientJS.addFile("documents", js_path + 'documents/documents.js');
    clientJS.addFile("documents", js_path + 'documents/documentsUtil.js');
    clientJS.addFile("documents", js_path + 'documents/documentsInit.js');

    /* Account */
    clientCSS.addFile("account", css_path + 'account/account.less');

    clientJS.addFile("account", node_modules + 'jquery.payment/lib/jquery.payment.js');

    clientJS.addFile("account", js_path + 'account/account.js');
    clientJS.addFile("account", js_path + 'account/accountUtil.js');
    clientJS.addFile("account", js_path + 'account/accountInit.js');

    /* Admin */
    clientCSS.addFile("admin", css_path + 'admin/admin.less');
    clientJS.addFile("admin", js_path + 'admin/admin.js');
    clientJS.addFile("admin", js_path + 'admin/adminUtil.js');
    clientJS.addFile("admin", js_path + 'admin/adminInit.js');
};
