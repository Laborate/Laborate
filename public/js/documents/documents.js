//Url Parameters
window.url_params = function() {
    params = /\/documents\/(\d*)\/(.*)/.exec(window.location.href);
    params_dict = {};

    if(params) {
        params_dict["location"] = params[1];
        params_dict["dir"] = params[2];
    } else {
        params_dict["location"] = "online";
        params_dict["dir"] = "";
    }
    return params_dict;
}

//History Change
window.onpopstate = function() {
   window.documents.locationChange(window.url_params()["location"], window.url_params()["dir"], true);
};

$(".newFile").live("click", function() {
    window.notification.open("creating file in current directory...");
    if(window.url_params()["dir"]) {
        var path = window.url_params()["dir"] + "Untitled Document";
    } else {
        var path = "";
    }

    window.documents.newFile("Untitled Document", JSON.stringify([""]), $("#" + window.sidebar).attr("data"),
                             path, window.sidebar,
         function(id) {
             window.documents.goToTab("/editor/?i=" + id);
             window.notification.close();
         }
    );
});

$("#locations #add_location").live("hover", function() {
    $("#locations #remove_location").css("border-left", "solid 1px #b5b5b5");
});

$("#locations #add_location").live("mouseout", function() {
    $("#locations #remove_location").css("border-left", "");
});

//Close Pop Up
$("#popup_header_exit, #popup_backdrop").live("click", function() {
    window.documents.popUpClose();
});

//Change File Library Based Off Of Location
$("#locations:not(.remove) ul li").live("click", function() {
    window.documents.locationChange($(this).attr("id"));
});

//Add Location
$("#locations #add_location").live("click", function() {
    window.documents.addLocation();
});

//Remove Location
$("#locations.remove ul li").live("click", function() {
    window.documents.removeLocation($(this));
});

//Set Toggle Remove Class
$("#locations #remove_location, #locations #finished_remove_location").live("click", function() {
    window.documents.toggleRemoveMode();
});

//Search
$(".file_search input").live("keyup", function() {
    $(this).parent("form").submit();
});

$(".file_search select").live("change", function() {
    $(this).parent("form").submit();
});

$(".file_search #clearSearch").live("click", function() {
    window.documents.fileSearchClear($(this));
});

$(".file_search").live("submit", function() {
    window.documents.fileSearch($(this));
    return false;
});

//File System
$(".online.file .file_attributes").live("click", function() {
    window.documents.goToLink("/editor/?i=" + $(this).parent().attr("data"));
    return false;
});

$(".external.file .file_attributes").live("click", function() {
    var type = $(this).attr("data");

    if(type == "folder") {
        window.documents.locationDirectory(window.sidebar, $(this).parent().attr("data"));
    }

    if(type == "file") {
        var extension = $(this).parent().find(".title").attr("data").split(".")[1];
        if(["png", "gif", "jpg", "jpeg"].indexOf(extension) > -1) {
            window.documents.photoPreview(window.sidebar, $(this).parent().find(".title").attr("data"),
                                          $(this).parent().attr("data"));
        } else {
            window.documents.locationFile(window.sidebar, $(this));
        }
    }
    return false;
});

$('.file').live("hover", function() {
    $("#" + $(this).find(".file_attributes").attr("data") + " .location_name").css("text-decoration", "underline");
    return false;
});

$('.file').live("mouseleave",function() {
    $("#" + $(this).find(".file_attributes").attr("data") + " .location_name").css("text-decoration", "");
    return false;
});

//Context Menu System (Right Click Menu)
$('.online.file').live("contextmenu", function(e) {
    window.documents.contextMenu($(this), e);
    return false;
});

//Menu Item Click
$("#menu li").live("click", function() {
    window.documents.contextMenuItem($(this));
});

$('body').live("contextmenu",function() {
    return false;
});

$("body").live("click", function() {
    window.documents.contextMenuClose();
});
