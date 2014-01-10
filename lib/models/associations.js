module.exports = function(model, associations, callback) {
    var data = {};

    $.each(associations, function(key, association) {
        model["get" + association.capitalize](function(error, info) {
            lib.error.capture(error);
            data[association] = info;

            if(associations.end(key)) {
                callback(data);
            }
        });
    });
}
