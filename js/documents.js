//Pop Up
function popUp(preset) {
    if(preset == "location") {
        $("#popup #location").show();
        $("#popup #popup_header #popup_header_name").text("New Location");
        $("#popup").css({"width": "280"});
    }

    $("#popup .selection").hide().eq(0).show();
    $("#popUp input[type=text], #popUp input[type=password], #popUp select").val('');
    $("#popup .selected").removeClass("selected");
    $("#popup").hAlign().vAlign().show();
    $("#popup_backdrop").show();
}

$("#popup #popup_location_type").live("change", function() {
    $("#popup .selection").hide();
    if($(this).val() == "ftp" || $(this).val() == "sftp") {
        $("#popup_location_ftp").show();
    }
    else {
        $("#popup_location_" + $(this).val()).show();
    }
    $("#popup").hAlign().vAlign();
});

$("#popup #popup_location_github ul li").live("click", function() {
    $("#popup #popup_location_github ul li").removeClass("selected");
    $(this).addClass("selected");
});


//New Location Submit
$("#popup .presets form").live("submit", function() {
    var type = $("#popup #popup_location_type").val();
    var passed = true;
    var items = {"type": type};

    if($("#popup #popup_location_name").val() == "") {
        $("#popup #popup_location_name").css({"border":"solid thin #CC352D"});
        passed = false;
    }
    else {
        $("#popup #popup_location_name").css({"border":""});
        items["name"] = $("#popup #popup_location_name").val();
    }

    $("#popup_location_" + type).find("input, select").each(function() {
        if($(this).val() == "") {
            $(this).css({"border": "solid thin #CC352D"});
            passed = false;
        }
        else {
            $(this).css({"border": ""});
            items[$(this).attr("name")] = $(this).val();
        }
    });

    if(type == "github") {
        if($("#popup_location_" + type + " .selected").text() == "") {
            $("#popup_location_" + type).css({"border": "solid thin #CC352D"});
            passed = false;
        }
        else {
            $("#popup_location_" + type).css({"border": ""});
            items["github_repository"] = $("#popup_location_" + type + " .selected").text();
        }
    }

    if(passed) {
        if(type == "github") { var icon = "icon-github"; }
        else { var icon = "icon-storage"; }
        var key = Math.floor((Math.random()*10000)+1);
        var li = '<li id="' + key +'"><span class="icon ' + icon +'"></span>' + $("#popup #popup_location_name").val() + '</li>';
        $("#locations ul").append(li);
        $("#popup").hide();
        $("#popup_backdrop").hide();
        $.post("server/php/user/update.php", { locations_add: [key, items] });
    }

    return false;
});


$("#popup_header_exit, #popup_backdrop").live("click", function() { $("#popup").hide(); $("#popup_backdrop").hide(); });
$("#add_location").live("click", function() { popUp("location"); });


//Search
$(".file_search select").live("change", function() { $(this).parent("form").submit(); });

$(".file_search #clearSearch").live("click", function() {
    $(this).parent("form").find('input:text, select').val('');
    $(this).parent("form").submit();
});

$(".file_search").live("submit", function() {
    var form = $(this);
    var search = form.find("input[name=s]").val();

    if(window.sidebar == "online") {
        var protection = form.find("select[name=p]").val();
        var relation = form.find("select[name=r]").val();

        $("#location_" + window.sidebar + " .file").each(function() {
            var show = true;
            if($(this).find(".title").text().toLowerCase().indexOf(search) < 0) { show = false; }
            if(protection != $(this).find(".file_attributes").attr("data")[0] && protection != "") { show = false; }
            if(relation != $.trim($(this).find(".file_attributes").text())[0] && relation != "") { show = false; }
            if(show) { $(this).show(); } else { $(this).hide(); }
        });

        if($("#location_" + window.sidebar + " .file:visible").length == 0) {
            $("#location_" + window.sidebar + " .notFound").show();
            form.find("#clearSearch").show();
            if($(window).width() < 980) { form.find("#newFile").hide(); }
            else { form.find("#newFile").show(); }

        } else {
            $("#location_" + window.sidebar + " .notFound").hide();
            form.find("#clearSearch").hide();
            form.find("#newFile").show();
        }
    }

    return false;
});

//SideBar Menu System
$(window).ready(function() {
    $("#locations").css("height", ($(window).height() - 120) + "px");
    $("#locations #online").addClass("selected");
    $("#location_online").show();
    window.sidebar = "online";
});

$(window).resize(function() { $("#locations").css("height", ($(window).height() - 120) + "px"); });

$("#locations ul li:not(.selected)").live("click", function() {
    $(".location").hide();
    $("#locations ul li").removeClass("selected");
    $(this).addClass("selected");
    window.sidebar = $(this).attr("id");

    if($(this).attr("id") == "online") {
        $("#files #location_online").show();
    }
    else {
        $("#files #location_template").show();
        updateFiles($(this).attr("id"));
    }
});

$("#locations #remove_location").live("click", function() {
    $("#locations").addClass("remove");
    $("#locations #online").hide();
});

$("#locations #cancel_remove_location").live("click", function() {
    $("#locations").removeClass("remove");
    $("#locations #online").show();
});

function updateFiles(id) {
    //$("#location_template_loading").hide();
}

//File System
$(".file .file_attributes").live("click", function() {
    window.location.href = "editor?i=" + $(this).parent().attr("data");
    return false;
});

$('.file').live("hover", function() {
    $(this).find(".title").text($(this).find(".title").attr("data"));
    return false;
});

$('.file').live("mouseleave",function() {
    var name = $(this).find(".title").attr("data");
    if(name.length > 12) { var title = name.substring(0, 10) + "..."; }
    else { var title = name; }
    $(this).find(".title").text(title);
    return false;
});

//Context Menu System (Right Click Menu)
$('.file').live("contextmenu", function(e) {
    if($.trim($(this).find(".file_attributes").text()) == "owner") { var action  = "Delete"; }
    else { var action = "Forget"; }

    $("#menu #action").text(action);

    if(($(window).width() - e.pageX) <= 130) { var left = e.pageX  - $("#menu").width(); }
    else { var left = e.pageX + 4; }

    $("#menu").css({"top": e.pageY + 16, "left": left}).attr("data", $(this).attr("data")).show();
    return false;
});

$("#menu li").live("click", function() {
    $("#menu").hide();
    var id = $(this).attr("id");
    var reference = $("#menu").attr("data");

    setTimeout(function() {
        if(id == "new") {
            window.location.href = "/editor";
        }

        if(id == "rename") {
            var name = prompt("File Name", $("#file_" + reference + " .title").attr("data"));
            if (name != null && name != "") {
                if(name.length > 12) { var title = name.substring(0, 10) + "..."; }
                else { var title = name; }

                $("#file_"+reference+" .title").attr("data", name);
                $("#file_"+reference+" .title").text(title);

                $.post("server/php/session/rename.php", { session_id: reference, session_name: name});
            }
        }

        if(id == "action") {
            $.post("server/php/session/actions.php", { session_id: reference});
            $("#file_" + reference).animate({"opacity": 0}, 500);
            setTimeout(function() {
                $("#file_" + reference).remove();
            }, 600);
        }

        if(id == "share") {
            prompt("Share Url", location.protocol + '//' + location.host+ "/editor?i=" + reference);
        }

    }, 100);
});

$('body').live("contextmenu",function(e) { return false; });
$("body").live("click", function() { $("#menu").hide(); });