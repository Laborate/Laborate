var editor = require("./editor");

module.exports = function(app) {
    app.io.route('editorJoin', editor.join);
    app.io.route('disconnect', editor.leave);
    app.io.route('editorChatRoom', editor.chatRoom);
}
