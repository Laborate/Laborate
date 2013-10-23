$(function() {
    $("#keyMap_" + $.cookie("keyMap")).attr("selected", "selected");
    window.sidebarUtil.keyMap($.cookie("keyMap"));
    window.sidebarUtil.change($("#sidebar_header .default").attr("id"));
});
