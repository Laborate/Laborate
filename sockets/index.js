var editor = require("./editor");

module.exports = function(app) {
    /* Editor */
    app.io.route('editorJoin', editor.join);
    app.io.route('editorChatRoom', editor.chatRoom);
    app.io.route('editorDocument', editor.document);
    app.io.route('editorUsers', editor.users);
    app.io.route('editorCursors', editor.cursors);

    /* Disconnect */
    app.io.route('disconnect', editor.leave);
}
