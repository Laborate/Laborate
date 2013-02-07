//Set Location Height On Resize
$(window).ready(function() {
    $("#navigation").css("height", ($(document).height() - 95) + "px");
});

//Set Location Height On Resize
$(window).resize(function() {
    $("#navigation").css("height", ($(document).height() - 95) + "px");
});