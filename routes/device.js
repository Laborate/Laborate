module.exports = function(req, res, next) {
    if(req.device.type == "desktop") {
        next();
    } else {
        req.device.type = req.device.type.charAt(0).toUpperCase() + req.device.type.slice(1);
        res.error(200, req.device.type + "'s aren't supported yet");
    }
}
