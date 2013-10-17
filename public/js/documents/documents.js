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
                    window.documents.fileDownload($(this), true);
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

$(document).on("click", ".select-files", function() {
    window.documents.fileSelectClick($(".files .file:not(.disabled)"));
});

$(document).on("click", ".download-files", function() {
    window.documents.fileSelect(true);
    window.documents.headerBar(["filters-non-online", "side-button"]);
    window.documents.mode = ["selectFiles", "download"];
    $(this).hide();
});

$(document).on("click", ".confirm-files, .cancel-files", function() {
    window.documents.headerBar(["filters-non-online", "download"]);
    var files = $(".files .file[data-selected=true]");
    if($(this).hasClass("confirm-files") && files.length != 0) {
        window.documents.fileDownload(files, false);
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

$(document).on("click", ".add-files #create", function() {
    window.documents.popup("create", false, "Create File");
});

$(document).on("click", ".add-files #upload", function() {
    window.documents.popupUpload();
});

$(document).on("submit", ".popup form", function() {
    window.documents.popupSubmit($(this));
    return false;
});
