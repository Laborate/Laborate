var core = require("./core");
var editor = require("./editor");

module.exports = function(app) {
    /* Core */
    app.io.route('pageTrack', core.pageTrack);
    app.io.route('notifications', core.notifications);

    /* Editor */
    app.io.route('editorJoin', editor.join);
    app.io.route('editorChatRoom', editor.chatRoom);
    app.io.route('editorDocument', editor.document);
    app.io.route('editorCursors', editor.cursors);
    app.io.route('editorExtras', editor.extras);
    app.io.route('editorDisconnectAll', editor.disconnectAll);

    /* Disconnect */
    app.io.route('disconnect', core.leave);
    app.io.route('reconnect_failed', core.leave);
}
