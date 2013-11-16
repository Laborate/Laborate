module.exports = function() {
    JSON.cycle = function(data) {
        return JSON.parse(JSON.stringify(data));
    }
}
