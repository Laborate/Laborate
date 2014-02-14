module.exports = function(ejs) {
    ejs.filters.capitalize = function(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    ejs.filters.header = function(str) {
        if(str.length <= 3) {
            return str.toUpperCase();
        } else {
            return $.map(str.split("_"), function(data) {
                return data.charAt(0).toUpperCase() + data.slice(1);
            }).join(" ");
        }
    };

    ejs.filters.format = function(input) {
        switch(typeof input) {
            case "boolean":
                return "<span class='" + config.icons[(input) ? "checked" : "unchecked"] + "'></span>" ;

            case "object":
                if(input === null || input === undefined) {
                    return "";
                } else if(input instanceof Date) {
                    return input.toDateString();
                } else {
                    return $.map(input, function(data, index) {
                        return "<strong>" + index + "</strong>: " + data;
                    }).join("<br>");
                }

            default:
                return input;
        }
    };
}
