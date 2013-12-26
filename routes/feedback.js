exports.index = function(req, res) {
    if(!req.session.user.feedback) {
        res.renderOutdated('feedback/index', {
            title: 'Feedback',
            questions: config.feedback.questions,
            js: clientJS.renderTags("backdrop"),
            css: clientCSS.renderTags("backdrop"),
            backdrop: req.backdrop(),
            pageTrack: true
        });
    } else {
        res.error(200, "1 Submission Per Day");
    }
};

exports.success = function(req, res) {
    if(req.session.user.feedback) {
        res.error(200, "Thank You");
    } else {
        res.redirect("/documents/");
    }
};

exports.submit = function(req, res) {
    if(!req.session.user.feedback) {
        req.models.users.feedback.create({
            user_id: req.session.user.id,
            feedback: req.param("feedback")
        }, function(error) {
            if(!error) {
                req.models.users.get(req.session.user.id, function(error, user) {
                    if(!error) {
                        user.save({
                            feedback: true
                        }, function(error, user) {
                            if(!error) {
                                req.session.user = user;
                                req.session.save();

                                res.json({
                                    success: true,
                                    next: "/feedback/success"
                                });
                            } else {
                                res.error(200, "Failed To Submit Feedback", error);
                            }
                        });
                    } else {
                        res.error(200, "Failed To Submit Feedback", error);
                    }
                });
            } else {
                res.error(200, "Failed To Submit Feedback", error);
            }
        });
    } else {
        res.error(200, "1 Submission Per Day");
    }
};

exports.results = function(req, res) {
    if(req.session.user.admin) {
        req.models.users.feedback.all(function(error, feedback) {
            if(!error) {
                res.renderOutdated('feedback/results', {
                    title: 'Feedback Results',
                    questions: config.feedback.questions,
                    results: feedback,
                    js: clientJS.renderTags(),
                    css: clientCSS.renderTags("feedback"),
                    pageTrack: true
                });
            } else {
                res.error(200, "Failed To Get Results", error);
            }
        });
    } else {
        res.error(404);
    }
};
