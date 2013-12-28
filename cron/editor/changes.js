require('../init')("editor.changes", function() {
    var _this = this;
    _this.redis.keys("editor*", function(error, documents) {
        if(!error && documents.length != 0) {
            $.each(documents, function(key, room) {
                _this.redis.get(room, function(error, reply) {
                    var reply = JSON.parse(reply);

                    _this.models.documents.exists(reply.id, function(error, exists) {
                        if(!error) {
                            if(exists) {
                                _this.models.documents.get(reply.id, function(error, document) {
                                    if(!error &&!$.isEmptyObject(document)) {
                                        _this.lib.jsdom.editor(document.content, reply.changes, function(content) {
                                            //Delay To Prevent Database Overload
                                            setTimeout(function() {
                                                document.save({
                                                    content: (content != "") ? content.split("\n") : [],
                                                    breakpoints: reply.breakpoints
                                                }, lib.error.capture);

                                                reply.changes = [];
                                                _this.redis.set(room, JSON.stringify(reply));
                                                if(documents.end(key)) _this.finish();
                                            }, 100);
                                        });
                                    } else {
                                        lib.error.capture(error);
                                        if(documents.end(key)) _this.finish();
                                    }
                                });
                            } else {
                                _this.redis.del(room, lib.error.capture);
                            }
                        } else {
                            lib.error.capture(error);
                        }
                    });
                });
            });
        } else {
            lib.error.capture(error);
            _this.finish();
        }
    });
});
