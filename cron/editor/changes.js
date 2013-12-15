require('../init')(function() {
    var _this = this;
    _this.lib.redis.keys("editor*", function(error, documents) {
        if(!error && documents.length != 0) {
            $.each(documents, function(key, room) {
                _this.lib.redis.get(room, function(error, reply) {
                    var reply = JSON.parse(reply);

                    _this.models.documents.get(reply.id, function(error, document) {
                        if(!error && document) {
                            _this.lib.jsdom.editor(document.content, reply.changes, function(content) {
                                //Delay To Prevent Database Overload
                                setTimeout(function() {
                                    document.save({
                                        content: content.split("\n"),
                                        breakpoints: reply.breakpoints
                                    }, lib.error.capture);

                                    reply.changes = [];
                                    _this.lib.redis.set(room, JSON.stringify(reply));
                                    if(!--documents.length) _this.finish();
                                }, 100);
                            });
                        } else {
                            lib.error.capture(error);
                            if(!--documents.length) _this.finish();
                        }
                    })
                });
            });
        } else {
            lib.error.capture(error);
            _this.finish();
        }
    });
});
