exports.index = function(req, res, next) {
    switch(req.param(0)) {
        case "verify":
            req.email_test("verify", {
                name: config.profile.name.capitalize,
                code: "abcasdfjkl0324halsdf"
            }, render(req, res));
            break;

        case "reset":
            req.email_test("reset", {
                name: config.profile.name.capitalize,
                code: "abcasdfjkl0324halsdf"
            }, render(req, res));
            break;

        case "document/invite":
            req.email_test("document_invite", {
                name: config.profile.name.capitalize,
                document: {
                    from: "jashanD",
                    id: "adfasdfasdf",
                    name: "hello_world.js",
                    access: "editor",
                    laborators: []
                }
            }, render(req, res));
            break;

        case "document/invite/2":
            req.email_test("document_invite", {
                name: config.profile.name.capitalize,
                document: {
                    from: "jashanD",
                    id: "adfasdfasdf",
                    name: "hello_world.js",
                    access: "viewer",
                    laborators: $.map(Array(2), function() {
                        return {
                            name: config.profile.screen_name,
                            gravatar: "/favicon/500.png"
                        }
                    })
                }
            }, render(req, res));
            break;

        case "document/invite/3":
            req.email_test("document_invite", {
                name: config.profile.name.capitalize,
                document: {
                    from: "jashanD",
                    id: "adfasdfasdf",
                    name: "hello_world.js",
                    access: "viewer",
                    laborators: $.map(Array(5), function() {
                        return {
                            name: config.profile.screen_name,
                            gravatar: "/favicon/500.png"
                        }
                    })
                }
            }, render(req, res));
            break;

        case "document/invite/4":
            req.email_test("document_invite", {
                name: config.profile.name.capitalize,
                document: {
                    from: "jashanD",
                    id: "adfasdfasdf",
                    name: "hello_world.js",
                    access: "viewer",
                    laborators: $.map(Array(15), function() {
                        return {
                            name: config.profile.screen_name,
                            gravatar: "/favicon/500.png"
                        }
                    })
                }
            }, render(req, res));
            break;

        case "payment/failed":
            req.email_test("payment_failed", {
                name: config.profile.name.capitalize
            }, render(req, res));
            break;

        case "feedback":
            req.email_test("feedback", {
                name: config.profile.name.capitalize
            }, render(req, res));
            break;

        default:
            res.error(404);
            break;
    }
}

function render(req, res) {
    return function(error, html) {
        if(!error) {
            res.send(html);
        } else {
            res.error(404);
            req.error.capture(error);
        }
    }
}
