//Set Location Height On Resize
$(window).resize(function() {
    window.account.navigationResize();
});

$("#navigation ul li").live("click", function() {
    window.account.navigationChange($(this).attr("id"));
});