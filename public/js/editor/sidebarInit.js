$(function() {
    window.sidebarUtil.populateLanguages();
    window.sidebarUtil.keyMap($.cookie("keyMap"));
    window.sidebarUtil.defaultKeymap($.cookie("keyMap"));

    //Refresh Laborators List Every 5 Minutes
    setInterval(window.sidebarUtil.laborators, 300000);
});
