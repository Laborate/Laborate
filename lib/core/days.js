exports.next_month = function() {
    var now = new Date();
    if (now.getMonth() == 11) {
        var current = new Date(now.getFullYear() + 1, 0, 1);
    } else {
        var current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }

    return Math.abs(current.getTime()/1000);
}

exports.format = function(date) {
    date = date || new Date();

    var days = [
         "Sunday", "Monday", "Tuesday", "Wednesday",
        "Thursday", "Friday", "Saturday"
    ]

    var months = [
        "January", "Feburary", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    var curr_day = date.getDay();
    var curr_date = date.getDate();
    var curr_month = date.getMonth();
    var curr_year = date.getFullYear();

    return [
        days[curr_day] + ",",
        months[curr_month],
        curr_date,
        curr_year
    ].join(" ");
}
