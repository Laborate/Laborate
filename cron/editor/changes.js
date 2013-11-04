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
                                document.save({
                                    content: content.split("\n"),
                                    breakpoints: reply.breakpoints
                                }, function() {
                                    if(key == (documents.length - 1)) {
                                        _this.redisClient.end();
                                        process.exit(code=0);
                                    }
                                });
                            });
                        } else {
                            if(error) {
                                ravenClient.captureError(error, "cron");
                            }

                            if(key == (documents.length - 1)) {
                                _this.redisClient.end();
                                process.exit(code=0);
                            }
                        }
                    })
                });
            });
        } else {
            if(error) {
                ravenClient.captureError(error, "cron");
            }

            _this.redisClient.end();
            process.exit(code=0);
        }
    });
});
