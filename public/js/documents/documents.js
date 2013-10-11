$(document).on("click", ".locations .item", function() {
    window.documents.location($(this).data("key"), "", true);
});

$(document).on("mouseover mouseout", ".files .item", function() {
    if(window.documents.locationActivated == "online") {
        var location = $(".locations .item[data-key='" + $(this).data("location") + "']")
        location.toggleClass("hover", (!location.hasClass("hover")));
    }
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
                if(["file-template", "file-script"].indexOf($(this).data("type")) != -1) {
                    window.documents.fileSelectClick($(this));
                }
            } else {
                if(["file-template", "file-script"].indexOf($(this).data("type")) != -1) {
                    window.documents.fileDownload($(this));
                } else if($(this).data("type") == "file-image") {
                    window.documents.popup("image",
                        "/documents/location/" + window.documents.locationActivated + "/" + $(this).data("path"),
                        $(this).data("name"));
                }
            }
        }
    }
});

$(document).on("click", ".popup, .popup .close", function(e) {
    if(e.target == this) window.documents.popup("close");
});

$(document).on("click", ".download-files", function() {
    window.documents.fileSelect(true);
    window.documents.mode = ["selectFiles", "download"];
    $(this).hide();
    $(".confirm-files, .cancel-files").show();
});

$(document).on("click", ".confirm-files, .cancel-files", function() {
    $(".confirm-files, .cancel-files").hide();
    $(".download-files").show();

    var files = $(".files .file[data-selected=true]");
    if($(this).attr("class") == "confirm-files" && files.length != 0) {
        window.documents.fileDownload(files);
    }

    window.documents.fileSelect(false);
});

$(document).on("keyup", "#search input", function() {
    $(this).parent("form").submit();
});

$(document).on("submit change", "#search, .filters select:visible", function() {
    window.documents.fileSearch($(this).find("input").val(), $(".filters select:visible"));
    return false;
});
