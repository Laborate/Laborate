$(document).on("click", ".locations .item", function() {
    window.documents.location($(this).data("key"), "", true);
});

$(document).on("click", ".files .item", function() {
    if(window.documents.locationActivated == "online") {
        window.location.href = "/editor/" + $(this).data("id");
    } else {
        if(["back", "folder", "folder-symlink"].indexOf($(this).data("type")) != -1) {
            window.documents.location(window.documents.locationActivated,
                $(this).data("path"), true);
        } else {
            if(window.documents.mode[0] == "selectFiles") {
                window.documents.fileSelectClick($(this));
            }
        }
    }
});

$(document).on("click", ".actions .action", function() {
    $(".actions .action").removeClass("active");
    var toggle = (window.documents.mode[1] != $(this).data("action"));
    window.documents.fileSelect(toggle);
    window.documents.mode = (toggle) ? [
        "selectFiles",
        $(this).data("action")
    ] : [];
    $(this).toggleClass("active", toggle);
    $(".actions .confirm").toggle(toggle);
});

$(document).on("click", ".actions .confirm", function() {
    $(".actions .action").removeClass("active");
    $(".confirm").hide();
    documents.fileProgress($(".files .file[data-selected=true]"), 100);
    window.documents.fileSelect(false);
});
