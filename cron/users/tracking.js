require('../init')(function() {
    var _this = this;
    _this.lib.redis.get("tracking", function(error, tracking) {
        if(!error && tracking) {
            _this.models.tracking.create(JSON.parse(tracking), function(error) {
                lib.error.capture(error);
                _this.lib.redis.set("tracking", JSON.stringify([]), function(error) {
                    lib.error.capture(error);
                    _this.finish();
                });
            });
        } else {
            lib.error.capture(error);
            _this.finish();
        }
    });
});
