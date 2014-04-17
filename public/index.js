module.exports = function(root) {
    var css_path   = __dirname + '/less/';
    var js_path    = __dirname + '/js/';
    var node_modules = root + '/node_modules/';
    var codemirror_path = node_modules + 'codemirror/';

    /* Core */
    clientCSS.addFile(css_path + 'core/core.less');
    clientCSS.addFile(css_path + 'core/body.less');
    clientCSS.addFile(css_path + 'core/icons.less');
    clientCSS.addFile(css_path + 'core/popup.less');
    clientCSS.addFile(css_path + 'core/contextmenu.less');
    clientCSS.addFile(css_path + 'core/groups.less');
    clientCSS.addFile(css_path + 'core/header.less');
    clientCSS.addFile(css_path + 'core/jscroll.less');

    clientCSS.addUrl('https://fonts.googleapis.com/css?family=Open+Sans:400,300');

    clientJS.addUrl('https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js');
    clientJS.addUrl('https://d3nslu0hdya83q.cloudfront.net/dist/1.0/raven.min.js');
    clientJS.addUrl('/socket.io/socket.io.js');

    clientJS.addFile(js_path + 'core/resize.js');
    clientJS.addFile(js_path + 'core/waypoints.js');
    clientJS.addFile(js_path + 'core/jscrollpane.js');
    clientJS.addFile(js_path + 'core/mousewheel.js');
    clientJS.addFile(js_path + 'core/center.js');
    clientJS.addFile(js_path + 'core/colors.js');
    clientJS.addFile(js_path + 'core/cookie.js');
    clientJS.addFile(js_path + 'core/core.js');
    clientJS.addFile(js_path + 'core/header.js');

    clientJS.addExec(lib.core.extensions);

    /* EDT Debugger */
    clientJS.addFile(root + '/lib/debugger/edt.js');

    /* Landing */
    clientCSS.addFile("landing", css_path + 'landing/index.less');
    clientJS.addFile("landing", js_path + 'landing/index.js');

    /* Landing Mobile */
    clientCSS.addFile("mobile", css_path + 'landing/mobile.less');
    clientJS.addFile("mobile", js_path + 'landing/mobile.js');

    /* Welcome */
    clientCSS.addFile("welcome", css_path + 'welcome/index.less');
    clientJS.addFile("welcome", js_path + 'welcome/index.js');

    /* Users */
    clientCSS.addFile("users", css_path + 'users/index.less');

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

    /* Highlight.js */
    clientJS.addFile("highlight", js_path + 'highlight/index.js');
    clientCSS.addFile("highlight", css_path + 'highlight/index.less');

    /* CodeMirror */
    clientCSS.addFile("codemirror", codemirror_path + 'lib/codemirror.css');
    clientCSS.addFile("codemirror", css_path + 'editor/laborate.less');

    clientJS.addFile("codemirror", codemirror_path + 'lib/codemirror.js');
    clientJS.addFile("codemirror", codemirror_path + 'addon/mode/loadmode.js');
    clientJS.addFile("codemirror", codemirror_path + 'addon/display/placeholder.js');
    clientJS.addFile("codemirror", codemirror_path + 'mode/meta.js');

    /* CodeMirror Movie */
    clientJS.addFile("codemirror-movie", js_path + 'editor/movie.js');

    /* Editor */
    clientCSS.addFile("editor", css_path + 'editor/editor.less');

    clientCSS.addFile("editor", codemirror_path + 'addon/dialog/dialog.css');

    clientJS.addFile("editor", codemirror_path + 'addon/search/match-highlighter.js');
    clientJS.addFile("editor", codemirror_path + 'addon/search/search.js');
    clientJS.addFile("editor", codemirror_path + 'addon/search/searchcursor.js');
    clientJS.addFile("editor", codemirror_path + 'addon/edit/matchbrackets.js');
    clientJS.addFile("editor", codemirror_path + 'addon/edit/trailingspace.js');
    clientJS.addFile("editor", codemirror_path + 'addon/edit/closebrackets.js');
    clientJS.addFile("editor", codemirror_path + 'addon/edit/closetag.js');
    clientJS.addFile("editor", codemirror_path + 'addon/edit/matchtags.js');
    clientJS.addFile("editor", codemirror_path + 'addon/fold/xml-fold.js');
    clientJS.addFile("editor", codemirror_path + 'addon/mode/overlay.js');
    clientJS.addFile("editor", codemirror_path + 'addon/dialog/dialog.js');
    clientJS.addFile("editor", codemirror_path + 'keymap/vim.js');
    clientJS.addFile("editor", codemirror_path + 'keymap/emacs.js');

    clientJS.addOb("editor", {
        file_size: lib.core.file_size
    });

    clientJS.addFile("editor", js_path + 'editor/modes.js');
    clientJS.addFile("editor", js_path + 'editor/editor.js');
    clientJS.addFile("editor", js_path + 'editor/editorUtil.js');
    clientJS.addFile("editor", js_path + 'editor/editorInit.js');
    clientJS.addFile("editor", js_path + 'editor/sidebar.js');
    clientJS.addFile("editor", js_path + 'editor/sidebarInit.js');
    clientJS.addFile("editor", js_path + 'editor/sidebarUtil.js');
    clientJS.addFile("editor", js_path + 'editor/chatRoom.js');


    /* Editor Embed */
    clientCSS.addFile("editor-embed", css_path + 'editor/embed.less');

    /* Terminal Lookup */
    clientCSS.addFile("terminal-lookup", css_path + 'terminal/index.less');
    clientJS.addFile("terminal-lookup", js_path + 'terminal/index.js');

    /* Terminal SSH */
    clientCSS.addFile("terminal", css_path + 'terminal/terminal.less');

    clientJS.addFile("terminal", node_modules + 'term.js/src/term.js');
    clientJS.addFile("terminal", js_path + 'terminal/terminal.js');

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

	/* News */
	clientCSS.addFile('news', css_path + 'news/index.less');
	clientJS.addFile('news', js_path + 'news/index.js');
	clientJS.addFile('news', js_path + 'news/util.js');
	clientJS.addFile('news', js_path + 'news/init.js');

	/* Groups */
	clientCSS.addFile('groups', css_path + 'groups/index.less');
	clientJS.addFile('groups', js_path + 'groups/index.js');
	clientJS.addFile('groups', js_path + 'groups/util.js');
    clientJS.addFile('groups', js_path + 'groups/init.js');
};
