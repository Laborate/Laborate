var moment = require("moment-range");

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

    ejs.filters.link = function(str) {
        return str.replace("http://", "").replace("https://", "");
    };

    ejs.filters.format = function(input) {
        switch(typeof input) {
            case "number":
                return input.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            case "boolean":
                if(input) {
                    return "<span class='" + config.icons.checked + " green'></span>" ;
                } else {
                    return "<span class='" + config.icons.unchecked + "'></span>" ;
                }

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

    ejs.filters.duration = function(date) {
        return moment.duration(date - new Date()).humanize(true);
    }
}
