$(".locations .item").live("click", function() {
    window.documents.location($(this).data("key"), "", true);
});

$(".files .item").live("click", function() {
    if(window.documents.locationActivated == "online") {
        window.location.href = "/editor/" + $(this).data("id");
    } else {
        if(["back", "folder", "folder-symlink"].indexOf($(this).data("type")) != -1) {
            window.documents.location(window.documents.locationActivated,
                $(this).data("path"), true);
        }
    }
});
