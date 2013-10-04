$(".locations .item").live("click", function() {
    window.documents.location($(this).data("key"), "", true);
});

$(".files .file").live("click", function() {
    if(window.documents.locationActivated == "online") {
        window.location.href = "/editor/" + $(this).data("id");
    }
});
