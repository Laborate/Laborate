var sprintf = require("sprintf-js").vsprintf;

module.exports = function() {
    JSON.cycle = function(data) {
        return JSON.parse(JSON.stringify(data));
    }

    String.prototype.__defineGetter__("capitalize", function() {
        return $.map(this.split(" "), function(value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }).join(" ");
    });

    String.prototype.sprintf = function(arguments) {
        return sprintf(this, arguments);
    };

    Array.prototype.__defineGetter__("empty", function() {
        return this.length == 0;
    });

    Array.prototype.end = function(index) {
        return (this.length-1) == index;
    };

    /* Piler Library Breaks When Setting This Getter
    Object.prototype.__defineGetter__("empty", function() {
        return Object.keys(this).length == 0;
    });
    */
}
