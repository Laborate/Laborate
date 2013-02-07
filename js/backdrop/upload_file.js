function UpdateSlider (percent) {
        $("#upload_section .backdropInitalWelcome").text("Uploading...");
		var slider 	  = $("#upload_slider")
		var text 	  = $("#upload_text")
		var new_val   = Math.round((percent < 0) ? 0 : ((percent > 100) ? 100 : percent))
		var left_over = 100 - new_val - 2
		if (new_val == 0) {
			slider.css({width : 0 + "%"}).text("")
			text.css({width : 98 + "%"}).text(0 + "%").show();
		} else {
    		slider.css({"visibility" : "visible"});
		}

		function changeBar() {

			if (new_val < 20) {
				text.animate({width : left_over + "%"}).text(new_val + "%").show();
				slider.animate({width : new_val + "%"}).text("")
			}
			else {
				text.hide().width("0px").val("")
				slider.animate({width : new_val + "%"}).text(new_val + "%")
			}

			setTimeout(function(){finishCheck();}, 1000)
		}

		function finishCheck() {
			if(new_val == 100) {
				 $("#upload_section").slideUp("slow");
				 $("#initialForm").slideDown("slow");
				 slider.css({"visibility" : "hidden"});
			}
		}

		changeBar();
		return false;
};

$(window).ready(function() {
    //convert upload form to ajax form (runs in background - no reload required)
	$('#file_upload').ajaxForm({success:  upload_file});
})

//Trigger Upload Proccess
$("#backdropUpload").live("click", function() {
   $("#backdropUploadFile").click();
});

$("#backdropUploadFile").live('change', function(){
	setTimeout(function() {
	   window.editor.setValue("");
	   $(".textError").fadeOut();
	   $("#initialForm").slideUp("slow");
	   $("#upload_section").slideDown("slow");
    }, 500);
	$("#backdropDocTitle").css("border", "thin solid #999");
	$("#backdropDocTitle").val($(this).val().replace(/C:\\fakepath\\/i, ''));
	UpdateSlider(0);
	setTimeout(function(){UpdateSlider(25); $('#file_upload').submit();}, 1500)
});

function upload_file(responseText) {
	UpdateSlider(50);
	setTimeout(function(){ extract();}, 500);

	function extract() {
		UpdateSlider(60);
		var html = responseText;
		setTimeout(function(){ UpdateSlider(80); }, 500);
        window.editor.setValue(responseText);
        setTimeout(function(){ UpdateSlider(100); }, 1000);
	}
}