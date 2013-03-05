function sidebar(module, focusElement) {
    $(".sidebar_content_inner").hide();
	$("#sidebar_header img").removeClass("state_active");
	$("#sidebar_header #" + module).addClass("state_active");

	if($("#sidebar_"+ module).length == 0) {
	    $.get('/includes/sidebar_' + module + '.php?i=' + getUrlVars()['i'],
			function(newHtml) {
				$("#sidebar_content").append(newHtml);
				if('initialize_' + module in window) {window['initialize_' + module]();}
				$("#" + focusElement).focus();
             }
         );
	}
	else {
		$("#sidebar_"+ module).show();
		$("#" + focusElement).focus();
    }
};

$("#sidebar #sidebar_header img").live("click mousedown", function() { return false; });