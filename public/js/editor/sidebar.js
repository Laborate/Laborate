$(window).ready(function() {
    $.each($("#sidebar_header img"), function() {
        var module = $(this).attr("id");
        if(window.url_params()["document"] == undefined) {
            var url = '/includes/sidebar_' + module + '.php';
        } else {
            var url = '/includes/sidebar_' + module + '.php?i=' + window.url_params()["document"];
        }

        $.get(url, function(newHtml) {
			$("#sidebar_content").append(newHtml);
			if('initialize_' + module in window) {
    			window['initialize_' + module]();
            }
         });
    });
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
