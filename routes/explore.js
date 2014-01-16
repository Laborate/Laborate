var async = require('async');

exports.index = function(req, res, next) {
    var hot_documents = [];
    req.models.documents.page(1).order("viewed", "Z").run(function (error, documents) {
        async.each(documents, function(document, callback) {
            var users = [];

            async.each(document.roles, function(role, callback) {
                role.getUser(function(error, user) {
                    users.push(user);
                    callback(error);
                });
            }, function(errors) {
                document.getOwner(function(error, owner) {
                    callback(errors);

                    hot_documents.push({
                        document: {
                            pub_id: document.pub_id,
                            name: document.name,
                            size: document.size(true)
                        },
                        owner: owner.screen_name,
                        users: users
                    });
                });
            });
        }, function(errors) {
            if(!errors) {
                res.renderOutdated('explore/index', {
                    title: 'Explore',
                    documents: hot_documents,
                    js: clientJS.renderTags("explore", "backdrop"),
                    css: clientCSS.renderTags("explore", "backdrop"),
                    backdrop: req.backdrop(),
                    pageTrack: true
                });
            } else {
                res.error(404, null, errors);
            }
        });
    });
}
