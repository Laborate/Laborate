$(function() {
    window.sidebarUtil.populateLanguages();
    window.sidebarUtil.keyMap($.cookie("keyMap"));
    window.sidebarUtil.defaultKeymap($.cookie("keyMap"));
    window.sidebarUtil.cursorSearch($.cookie("cursorSearch") === "true");
    window.sidebarUtil.defaultCursorSearch($.cookie("cursorSearch"));

    //Refresh Laborators List Every 5 Minutes
    setInterval(window.sidebarUtil.laborators, 300000);
});
