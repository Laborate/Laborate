$(function() {
    $("#keyMap_" + $.cookie("keyMap")).attr("selected", "selected");
    window.sidebarUtil.keyMap($.cookie("keyMap"));
});
