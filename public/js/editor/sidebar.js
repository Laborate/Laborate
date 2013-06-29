$(window).ready(function() {
    sidebar($("#sidebar_header .default").attr("id"));
});

function sidebar(module, focusElement) {
    $(".sidebar_content_inner").hide();
	$("#sidebar_header img").removeClass("state_active");
	$("#sidebar_header #" + module).addClass("state_active");
	$("#sidebar_"+ module).show();
	$("#" + focusElement).focus();
};

$("#sidebar_header img").live("click", function() {
    sidebar($(this).attr("id"), "");
});

$("#sidebar #sidebar_header img").live("click mousedown", function() {
    return false;
});
