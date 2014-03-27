var async = require("async");

require('../init')("editor.changes", function() {
    var _this = this;
    _this.redis.keys("editor*", function(error, documents) {
        if(!error && !documents.empty) {
            async.each(documents, function(room, next) {
                _this.redis.get(room, function(error, reply) {
                    var reply = JSON.parse(reply);

                    if(!reply.changes.empty) {
                        _this.models.documents.get(reply.id, function(error, document) {
                            if(!error && document) {
                                if(reply.pub_id == document.pub_id) {
                                    _this.lib.jsdom.editor(document.content, reply.changes, function(content) {
                                        document.save({
                                            content: (content != "") ? content.split("\n") : [],
                                                breakpoints: reply.breakpoints
                                        }, function(error) {
                                            if(Object.keys(reply.users).empty) {
                                                _this.redis.del(room);
                                            } else {
                                                reply.changes = [];
                                                _this.redis.set(room, JSON.stringify(reply));
                                            }

                                            next(error);
                                        });
                                    });
                                } else {
                                    next(error);
                                }
                            } else {
                                next(error);
                                _this.redis.del(room);
                            }
                        });
                    } else {
                        next(error);
                    }
                });
            }, _this.finish);
        } else {
            _this.finish(error);
        }
    });
});
