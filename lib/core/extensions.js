module.exports = function() {
    JSON.cycle = function(data) {
        return JSON.parse(JSON.stringify(data));
    }

    String.prototype.capitalize = function() {
        return $.map(this.split(" "), function(value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }).join(" ");
    };

    Array.prototype.__defineGetter__("empty", function() {
        return this.length == 0;
    });

    /* Piler Library Breaks When Setting This Getter
    Object.prototype.__defineGetter__("empty", function() {
        return Object.keys(this).length == 0;
    });
    */
}
