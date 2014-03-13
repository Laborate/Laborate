$(function(){
    $(".group .info").vAlign();

    $(".form[name=create]").submit(function(e) {
        window.groupsUtil.create($(this));
        e.preventDefault();
    });
});
