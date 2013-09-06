$("#navigation ul li").live("click", function() {
    window.account.navigationChange($(this).attr("id"));
});
