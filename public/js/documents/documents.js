$(document).on("click", ".sidebar .options .option", function() {
    window.documents.location($(this).data("key"), "", true, true);

    if(window.documents.terminalActive != window.documents.locationActivated) {
        window.documents.terminal(true);
    }
});

$(document).on("mouseover mouseout", ".pane .item", function() {
    if(window.documents.locationActivated == "online") {
        var location = $(".options .option[data-key='" + $(this).data("location") + "']")
        location.toggleClass("hover", (!location.hasClass("hover")));
    }
});

$(document).on("click", ".pane .item:not(.disabled)", function() {
    if(window.documents.locationActivated == "online") {
        window.location.href = "/editor/" + $(this).data("id") + "/";
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

$(document).on("click", ".popup .download", function() {
    $.fileDownload($(this)
        .parents(".popup")
        .find("#popup-image img")
        .attr("src"));
});

$(document).on("click", "#popup-widget .item", function() {
    window.documents.popupWidgetChange($(this));
});

$(document).on("keyup", "#popup-widget .custom input", function() {
    window.documents.popupWidgetChange($(this).parents(".item"));
});

$(document).on("click", ".terminal-button", function() {
    window.documents.terminal();
});

$(document).on("click", ".terminal a", function() {
    setTimeout(window.documents.terminal, 200);
    return true;
});

$(document).on("click", ".select-files", function() {
    window.documents.fileSelectClick($(".pane .file:not(.disabled)"));
});

$(document).on("click", ".download-files", function() {
    window.documents.fileSelect(true);
    window.documents.headerBar(["filters-non-online", "side-button"]);
    window.documents.mode = ["selectFiles", "download"];
    $(this).hide();
});

$(document).on("click", ".confirm-files, .cancel-files", function() {
    var files = $(".pane .file[data-selected=true]");

    if($(this).hasClass("confirm-files") && files.length != 0) {
        window.documents.fileDownload(files, false);
    }

    window.documents.fileSelect(false);
    window.documents.headerBar(window.documents.headerBarPreviousDouble);
});

$(document).on("keyup", ".search input", function() {
    window.documents.fileSearch($(this).val(), $(".filters select:visible"));
});

$(document).on("submit change", "#search, .filters select:visible", function() {
    window.documents.fileSearch($(".search input").val(), $(".filters select:visible"));
    return false;
});

$(document).on("click", ".add-files #create", function() {
    window.documents.popup("create", false, "Create File");
});

$(document).on("click", ".add-files #upload", function() {
    window.documents.popupUpload();
});

$(document).on("click", "#add-location, #popup-add-location .selectable", function() {
    window.documents.popupAddLocation($(this));
});

$(document).on("submit", ".popup form", function() {
    window.documents.popupSubmit($(this));
    return false;
});

//Context Menu System (Right Click Menu)
$(document).on("contextmenu", ".pane .item", function(event) {
    if(window.documents.locationActivated == "online") {
        window.documents.contextMenuOpen($(this), event);
    }
});

$(document).on("contextmenu", function() {
    return false;
});

$(document).on("click", ".context-menu .item", function() {
    window.documents.contextMenu($(this));
});

$(document).on("click", function() {
    window.documents.contextMenuClose();
});
