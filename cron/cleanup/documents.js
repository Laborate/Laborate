require('../init')("user.deliquent", function() {
    var _this = this;
    _this.models.documents.all({}, {
        autoFetch: true
    }, function(error, documents) {
        if(!error && !documents.empty) {
            $.each(documents, function(key, document) {
                if(!document.owner) {
                    document.remove(lib.error.capture);
                }

                if(documents.end(key)) _this.finish();
            });
        } else {
            lib.error.capture(error);
            _this.finish();
        }
    });
});
