require('../init')(function() {
    var _this = this;
    _this.redisClient.keys("editor*", function(error, documents) {
        if(!error && documents.length != 0) {
            $.each(documents, function(key, room) {
                _this.redisClient.get(room, function(error, reply) {
                    var reply = JSON.parse(reply);

                    _this.models.documents.get(reply.id, function(error, document) {
                        if(!error && document) {
                            _this.editorJsdom(document.content, reply.changes, function(content) {
                                //Delay To Prevent Database Overload
                                setTimeout(function() {
                                    document.save({
                                        content: content.split("\n"),
                                        breakpoints: reply.breakpoints
                                    }, lib.error.capture);

                                    reply.changes = [];
                                    _this.redisClient.set(room, JSON.stringify(reply));
                                }, 100);
                            });
                        } else {
                            lib.error.capture(error);
                        }
                    })
                });
            });
        } else {
            lib.error.capture(error);
        }
    });
});
