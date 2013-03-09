//Prevent Form Redirect
$("form").live("submit", function() { return false; });

$(window).ready(function() {
    $("body div").not("#backdrop, #backdrop div").hide();
    $("body").show();

    //Auto center backdrop core
	$("#backdropCore").vAlign().hAlign();

	//Turn Off Spell Check
    $("#backdrop input[type=text]").attr({"spellcheck": false});

    //Set Screen Name from cookie
    $("#backdropScreenName").val($.cookie("screenName"));
});

function finishBackdrop(title) {
    window.nodeSocket.emit('join', getUrlVars()['i']);
    setTimeout(function(){
        window.editorUtil.setTitle(title);
        window.chatRoom.screenNameChange("", $("#backdropScreenName").val());
        window.chatRoom.signIn();
        $("#backdrop, #backdrop div").hide();
        $("body div").not("#backdrop, #backdrop div, #contributor_info").show();
        $("#header #logo").hAlign().vAlign();
        window.editor.clearHistory();
        setTimeout(function(){ window.editor.refresh(); }, 1000);
    }, 100);
}
