$(document).on("click", "#navigation ul li", function() {
    window.account.navigationChange($(this).attr("id"));
});
