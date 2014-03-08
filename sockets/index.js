var core = require("./core");
var editor = require("./editor");
var terminal = require("./terminal");
var news = require("./news");

module.exports = function(app) {
    /* Core */
    app.io.route('join', core.join);
    app.io.route('pageTrack', core.pageTrack);
    app.io.route('notifications', core.notifications);

    /* Editor */
    app.io.route('editorJoin', editor.join);
    app.io.route('editorChatRoom', editor.chatRoom);
    app.io.route('editorDocument', editor.document);
    app.io.route('editorCursors', editor.cursors);
    app.io.route('editorLaborators', editor.laborators);
    app.io.route('editorExtras', editor.extras);
    app.io.route('editorPermission', editor.permission);
    app.io.route('editorSave', editor.save);

    /* Terminal */
    app.io.route('terminalJoin', terminal.join);
    app.io.route('terminalData', terminal.data);
    app.io.route('terminalResize', terminal.resize);

    /* Terminal */
    app.io.route('newsJoin', news.join);
    app.io.route('newsPost', news.post);
    app.io.route('newsReply', news.reply);
    app.io.route('newsLike', news.like);

    /* Connect */
    app.io.route('connected', core.track);

    /* Disconnect */
    app.io.route('disconnect', core.leave);
    app.io.route('reconnect_failed', core.leave);
}
