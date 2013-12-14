exports.index = function(req, res, next) {
    switch(req.param(0)) {
        case "verify":
            req.email_test("verify", {
                name: config.profile.name.capitalize(),
                code: "abcasdfjkl0324halsdf"
            }, render(res));
            break;

        case "reset":
            req.email_test("reset", {
                name: config.profile.name.capitalize(),
                code: "abcasdfjkl0324halsdf"
            }, render(res));
            break;

        case "document/invite":
            req.email_test("document_invite", {
                id: "adfasdfasdf",
                name: "hello_world.js",
                access: "Editor",
                collaborators: config.profile.screen_name,
                message: req.param("message")
            }, render(res));
            break;

        case "payment/failed":
            req.email_test("payment_failed", {
                name: config.profile.name.capitalize()
            }, render(res));
            break;
        default:
            res.error(404);
            break;
    }
}

function render(res) {
    return function(error, html) {
        if(!error) {
            res.send(html);
        } else {
            res.error(404);
            req.error.capture(error);
        }
    }
}
