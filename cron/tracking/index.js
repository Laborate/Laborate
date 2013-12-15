require('../init')(function() {
    var _this = this;
    _this.lib.redis.get("tracking", function(error, tracking) {
        if(!error && tracking) {
            console.log(tracking);
            _this.finish();
        } else {
            lib.error.capture(error);
            _this.finish();
        }
    });
});
