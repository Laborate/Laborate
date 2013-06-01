//History Change
window.onpopstate = function() {
   var location_parts = /\/documents\/location\/(\d*)\/(.*)/.exec(window.location.href)
   var location = (location_parts) ? [location_parts[1], location_parts[2]]  : ["online", ""];
   window.documents.locationChange(location[0], location[1]);
};

$(".newFile").live("click", function() {
    window.notification.open("creating file in current directory...");
    if(getUrlVars()['dir'] != undefined) {
        var path = getUrlVars()['dir'] + "Untitled Document".replace("//", "/");
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
        window.documents.locationFile(window.sidebar, $(this));
    }
    return false;
});

$('.file').live("hover", function() {
    $(this).find(".title").text($(this).find(".title").attr("data"));
    return false;
});

$('.file').live("mouseleave",function() {
    var name = $(this).find(".title").attr("data");
    var title = window.documents.nameToTitle(name);
    $(this).find(".title").text(title);
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