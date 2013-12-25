var questions = {
    changes: {
        question: "What changes would you like to see (theme, functionality, etc)?",
        type: "textarea"
    },
    missing: {
        question: "What do you feel is missing?",
        type: "textarea"
    },
    using: {
        question: "Could you see yourself using this site as a tool \
                    for your education? Why & Why Not?",
        type: "textarea"
    },
    bugs: {
        question: "Have you found any bugs?",
        type: "textarea"
    },
    effective: {
        question: "Is Laborate an effective tool for collaboration?",
        type: "radio"
    },
    difficulties: {
        question: "Are you experiencing any technical difficulties?",
        type: "radio"
    },
    pay: {
        question: "Would you pay $5 a month for this service, knowing \
                    that it will save you money in the long run?",
        type: "radio"
    },
    recommend: {
        question: "Would you recommend this service to your fellow peers?",
        type: "radio"
    }
}

exports.index = function(req, res) {
    if(!req.session.user.feedback) {
        res.renderOutdated('feedback/index', {
            title: 'Feedback',
            questions: questions,
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
                    questions: questions,
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
