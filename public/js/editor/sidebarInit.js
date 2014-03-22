$(function() {
    if(!config.embed) {
        window.sidebarUtil.populateLanguages();
        window.sidebarUtil.keyMap($.cookie("keyMap"));
        window.sidebarUtil.defaultKeymap($.cookie("keyMap"));
        window.sidebarUtil.cursorSearch($.cookie("cursorSearch") === "true");
        window.sidebarUtil.whiteSpace($.cookie("whiteSpace") === "true");
        window.sidebarUtil.defaultCursorSearch($.cookie("cursorSearch"));
        window.sidebarUtil.defaultWhiteSpace($.cookie("whiteSpace"));
        window.sidebarUtil.defaultTabs(parseInt($.cookie("tabs")));

        //Refresh Laborators List Every 5 Minutes
        setInterval(window.sidebarUtil.laborators, 300000);
    }
});
