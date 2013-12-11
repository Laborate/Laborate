module.exports = function() {
    JSON.cycle = function(data) {
        return JSON.parse(JSON.stringify(data));
    }

    Array.prototype.__defineGetter__("empty", function() {
        return this.length == 0;
    });

    /* Piler Library Breaks When Setting This Getter
    Object.prototype.__defineGetter__("empty", function() {
        return Object.keys(this).length == 0;
    });
    */
}
