$(function() {
    window.sidebarUtil.populateLanguages();
    window.sidebarUtil.keyMap($.cookie("keyMap"));
    window.sidebarUtil.defaultKeymap($.cookie("keyMap"));
    window.sidebarUtil.laborators();
});
