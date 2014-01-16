var async = require("async");

require('../init')("editor.changes", function() {
    var _this = this;
    _this.redis.keys("editor*", function(error, documents) {
        if(!error && !documents.empty) {
            async.each(documents, function(room, next) {
                _this.redis.get(room, function(error, reply) {
                    var reply = JSON.parse(reply);

                    _this.models.documents.get(reply.id, function(error, document) {
                        if(!error && document) {
                            _this.lib.jsdom.editor(document.content, reply.changes, function(content) {
                                document.save({
                                    content: (content != "") ? content.split("\n") : [],
                                    breakpoints: reply.breakpoints
                                }, lib.error.capture);

                                reply.changes = [];
                                _this.redis.set(room, JSON.stringify(reply), next);
                            });
                        } else {
                            next(error);
                            _this.redis.del(room);
                        }
                    });

                    });
            }, function(errors) {
                lib.error.capture(errors);
                _this.finish();
            });
        } else {
            lib.error.capture(error);
            _this.finish();
        }
    });
});
