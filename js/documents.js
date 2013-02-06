//Close Pop Up
$("#popup_header_exit, #popup_backdrop").live("click", function() {
    window.documents.popUpClose();
});


//Set Location Height On Resize
$(window).resize(function() {
    window.documents.locationsHeight();
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
$(".file_search select").live("change", function() { $(this).parent("form").submit(); });

$(".file_search #clearSearch").live("click", function() {
    window.documents.fileSearchClear($(this));
});

$(".file_search").live("submit", function() {
    window.documents.fileSearch($(this));
    return false;
});

//File System
$(".online.file .file_attributes").live("click", function() {
    window.location.href = "editor?i=" + $(this).parent().attr("data");
    return false;
});

$(".github.file .file_attributes").live("click", function() {
    var type = $(this).attr("data");

    if(type == "folder") {
        window.documents.githubDirectory(window.sidebar, $(this).parent().attr("data"));
    }

    if(type == "file") {
        window.documents.githubFile(window.sidebar, $(this));
    }
    return false;
});

$(".sftp.file .file_attributes").live("click", function() {
    var type = $(this).attr("data");

    if(type == "folder") {
        window.documents.sftpDirectory(window.sidebar, $(this).parent().attr("data"));
    }

    if(type == "file") {
        window.documents.sftpFile(window.sidebar, $(this));
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