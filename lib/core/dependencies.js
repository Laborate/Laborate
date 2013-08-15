module.exports = function() {
    var css_path   = __dirname + '/../../public/less/';
    var js_path    = __dirname + '/../../public/js/';
    var codemirror_path = __dirname + '/../../node_modules/codemirror/';

    /* Core */
    clientCSS.addFile(css_path + 'core/core.less');
    clientCSS.addFile(css_path + 'core/colors.less');
    clientCSS.addFile(css_path + 'core/form.less');
    clientCSS.addFile(css_path + 'core/notification.less');
    clientCSS.addFile(css_path + 'core/icons.less');

    clientJS.addFile(js_path + 'core/core.js');
    clientJS.addFile(js_path + 'core/copy.js');
    clientJS.addFile(js_path + 'core/center.js');
    clientJS.addFile(js_path + 'core/cookie.js');
    clientJS.addFile(js_path + 'core/colors.js');
    clientJS.addFile(js_path + 'core/notification.js');

    clientJS.addUrl('http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js');
    clientJS.addUrl('http://d3nslu0hdya83q.cloudfront.net/dist/1.0/raven.min.js');

    /* EDT Debugger */
    clientJS.addFile(__dirname + '/../debugger/edt.js');

    /* Backdrop */
    clientCSS.addFile("backdrop", css_path + 'backdrop/backdrop.less');
    clientCSS.addFile("backdrop", css_path + 'backdrop/loader.less');
    clientJS.addFile("backdrop", js_path + 'backdrop/backdrop.js');

    /* Header */
    clientCSS.addFile("header", css_path + 'core/header.less');
    clientJS.addFile("header", js_path + 'core/header.js');

    /* Chat Room */
    clientCSS.addFile("chat_room", css_path + 'editor/chatRoom.less');
    clientJS.addFile("chat_room", js_path + 'editor/chatRoom.js');

    /* jScroll */
    clientCSS.addFile("jscroll", css_path + 'core/jscrollpane.less');

    clientJS.addFile("jscroll", js_path + 'core/jscrollpane.js');
    clientJS.addFile("jscroll", js_path + 'core/mousewheel.js');

    /* CodeMirror */
    clientCSS.addFile("codemirror", codemirror_path + 'lib/codemirror.css');
    clientCSS.addFile("codemirror", css_path + 'editor/laborate.less');

    clientJS.addFile("codemirror", codemirror_path + 'lib/codemirror.js');
    clientJS.addFile("codemirror", codemirror_path + 'addon/mode/loadmode.js');
    clientJS.addFile("codemirror", codemirror_path + 'addon/display/placeholder.js');
    clientJS.addFile("codemirror", js_path + 'editor/modes.js');

    /* Editor */
    clientCSS.addFile("editor", css_path + 'editor/chatRoom.less');
    clientCSS.addFile("editor", css_path + 'editor/editor.less');
    clientCSS.addFile("editor", css_path + 'core/colors.less');
    clientCSS.addFile("editor", css_path + 'editor/sidebar.less');

    clientCSS.addFile("editor", codemirror_path + 'addon/dialog/dialog.css');

    clientJS.addUrl("editor", '/socket.io/socket.io.js');

    clientJS.addFile("editor", codemirror_path + 'addon/search/match-highlighter.js');
    clientJS.addFile("editor", codemirror_path + 'addon/search/search.js');
    clientJS.addFile("editor", codemirror_path + 'addon/search/searchcursor.js');
    clientJS.addFile("editor", codemirror_path + 'addon/edit/matchbrackets.js');
    clientJS.addFile("editor", codemirror_path + 'addon/selection/active-line.js');
    clientJS.addFile("editor", codemirror_path + 'addon/edit/closebrackets.js');
    clientJS.addFile("editor", codemirror_path + 'addon/edit/closetag.js');
    clientJS.addFile("editor", codemirror_path + 'addon/mode/overlay.js');
    clientJS.addFile("editor", codemirror_path + 'addon/dialog/dialog.js');
    clientJS.addFile("editor", codemirror_path + 'keymap/vim.js');
    clientJS.addFile("editor", codemirror_path + 'keymap/emacs.js');

    clientJS.addFile("editor", js_path + 'editor/editor.js');
    clientJS.addFile("editor", js_path + 'editor/editorUtil.js');
    clientJS.addFile("editor", js_path + 'editor/editorInit.js');
    clientJS.addFile("editor", js_path + 'editor/sidebar.js');
    clientJS.addFile("editor", js_path + 'editor/sidebarUtil.js');
    clientJS.addFile("editor", js_path + 'editor/chatRoom.js');

    /* Editor Auto Join */
    clientJS.addFile("editor-auto-join", js_path + 'editor/autoJoin.js');

    /* Documents */
    clientCSS.addFile("documents", css_path + 'documents/documents.less');

    clientJS.addFile("documents", js_path + 'documents/documents.js');
    clientJS.addFile("documents", js_path + 'documents/documentsUtil.js');
    clientJS.addFile("documents", js_path + 'documents/documentsInit.js');

    /* Account */
    clientCSS.addFile("account", css_path + 'account/account.less');

    clientJS.addFile("account", js_path + 'account/account.js');
    clientJS.addFile("account", js_path + 'account/accountUtil.js');
    clientJS.addFile("account", js_path + 'account/accountInit.js');
};
