//////////////////////////////////////////////////
//          Document Instances
/////////////////////////////////////////////////

window.documents = {
    popUp: function(preset) {
        //Inital Clean Up
        $("#popup .presets").hide();
        $("#popup .selection").hide().eq(0).show();
        $("#popUp input[type=text], #popUp input[type=password], #popUp select").val('').css({"border":""});
        $("#popup .selected").removeClass("selected");

        //Cycle Through Presets
        if(preset == "location_add") {
            $("#popup #location_add").show();
            $("#popup #popup_header #popup_header_name").text("New Location");
            $("#popup").css({"width": "280"});
        }

        if(preset == "location_delete") {
            $("#popup #location_remove").show();
            $("#popup #popup_header #popup_header_name").text("Confirm Location Deletion?");
            $("#popup").css({"width": "250"});

            $("#popup #location_remove input[type=button]").live("click", function() {
                popUpClose();
            });
        }

        //Auto Center And Show
        $("#popup").hAlign().vAlign().show();
        $("#popup_backdrop").show();
    },
    popUpClose: function() {
        //Remove Live Events From Forms
        $("#popup .presets form").die();
        $("#popup #popup_location_type").die();
        $("#popup #popup_location_github ul li").die();
        $("#popup #location_remove input[type=button]").die();

        //Hide Pop Up
        $("#popup").hide();
        $("#popup_backdrop").hide();
    },
    notification: function(html) {
        $("#files .notification").html(html).hAlign().show();
    },
    notificationClose: function() {
        $("#files .notification").hide();
    },
    contextMenu: function(element) {
        if($.trim(element.find(".file_attributes").text()) == "owner") { var action  = "Delete"; }
        else { var action = "Forget"; }

        $("#menu #action").text(action);

        if(($(window).width() - e.pageX) <= 130) { var left = e.pageX  - $("#menu").width(); }
        else { var left = e.pageX + 4; }

        $("#menu").css({"top": e.pageY + 16, "left": left}).attr("data", element.attr("data")).show();
        return false;
    },
    contextMenuItem: function(element) {
        window.documents.contextMenuClose();
        var id = element.attr("id");
        var reference = $("#menu").attr("data");

        setTimeout(function() {
            if(id == "new") {
                window.location.href = "/editor";
            }

            if(id == "rename") {
                var name = prompt("File Name", $("#file_" + reference + " .title").attr("data"));
                if (name != null && name != "") {
                    var title = nameToTitle(name);
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
    },
    contextMenuClose: function() {
       $("#menu").hide();
    },
    nameToTitle: function(name) {
        if(name.length > 12) { var title = name.substring(0, 10) + "..."; }
        else { var title = name; }
        return title;
    },
    locationsHeight: function() {
        $("#locations").css("height", ($(document).height() - 95) + "px");
    },
    locationChange: function(location_id, initializing) {
        $("#locations ul li").removeClass("selected");
        $("#" + location_id).addClass("selected");

        if(location_id == "online" || location_id == undefined) {
            $("#files #location_online").show();
            history.pushState(null, null, "/documents");
            location_id = "online";
        } else {
           $("#files #location_template #file_library").html("");
           $("#files #location_template").show();
           if(!initializing) {
               window.documents.getGithubDirectory(location_id);
            }
        }

        window.sidebar = location_id;
    },
    addLocation: function() {
        //Show Pop Up
        window.documents.popUp("location_add");

        //Look For Location Type Change
        $("#popup #popup_location_type").live("change", function() {
            $("#popup .selection").hide();

            if($(this).val() == "sftp") {
                $("#popup_location_sftp").show();
            }
            else {
                $("#popup_location_" + $(this).val()).show();
            }
            $("#popup").hAlign().vAlign();
        });

        //Add Select Class To Github Repository
        $("#popup #popup_location_github ul li").live("click", function() {
            $("#popup #popup_location_github ul li").removeClass("selected");
            $(this).addClass("selected");
        });

        //Check For Form Submit
        $("#popup .presets form").live("submit", function() {
            var type = $("#popup #popup_location_type").val();
            var type_icon = type;
            var passed = true;
            var items = {"type": type};

            //Check If Inputs Have Values
            if($("#popup #popup_location_name").val() == "") {
                $("#popup #popup_location_name").css({"border":"solid thin #CC352D"});
                passed = false;
            }
            else {
                $("#popup #popup_location_name").css({"border":""});
                items["name"] = $("#popup #popup_location_name").val();
            }

            $("#popup_location_" + type).find("input[type=text], select").each(function() {
                if($(this).val() == "") {
                    $(this).css({"border": "solid thin #CC352D"});
                    passed = false;
                }
                else {
                    $(this).css({"border": ""});
                    items[$(this).attr("name")] = $(this).val();
                }
            });

            if($("#popup_location_" + type).find("input[type=password]").clone() != "") {
                var pass = $("#popup_location_" + type).find("input[type=password]");
                items[pass.attr("name")] = pass.val();
            }

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
                if(type_icon == "github") { var icon = "icon-github"; }
                else if(type_icon == "sftp") { var icon = "icon-drawer-2"; }
                else { var icon = "icon-storage"; }
                var key = Math.floor((Math.random()*10000)+1);
                var li = '<li id="' + key +'"><span class="icon ' + icon +'"></span>' + $("#popup #popup_location_name").val() + '</li>';
                $("#locations ul").append(li);
                window.documents.popUpClose();
                $.post("server/php/user/update.php", { locations_add: [key, items] });
            }
            return false;
        });
    },
    removeLocation: function(elment) {
        var id = elment.attr("id");
        popUp("location_delete");

        $("#popup #location_remove input[type=button]").live("click", function() {
            li.remove();

            if(window.sidebar == id) {
                $(".location").hide();
                $("#files #location_online").show();
                $("#locations #online").addClass("selected");
                window.sidebar = "online";
            }

            $.post("server/php/user/update.php", { locations_remove: id });

            if($("#locations.remove ul li").size() == 1) {
                $("#locations").removeClass("remove");
                $("#locations #online").toggle().addClass("selected");
            }
        });
    },
    toggleRemoveMode: function() {
        $("#locations").toggleClass("remove");
        $("#locations #online").toggle();
    },
    locationTypeCheck: function(location_id) {
        alert("Needs To Be Done");
    },
    locationListing: function(callback) {
        $.post("server/php/locations/locations_listing.php",
            function(json) {
                var locations = "";
                $.each(JSON.parse(json), function(i, item) {
                    locations += '<li id="' + item['key'] + '"><span class="icon ' + item['icon'] + '"></span>' + item['name'] + '</li>';
                });
                $("#locations ul").append(locations);
                callback(true);
            }
        );
    },
    onlineDirectory: function(callback) {
        $.post("server/php/locations/online_directory.php",
            function(json) {
                var files = "";
                $.each(JSON.parse(json), function(i, item) {
                    var file = '<div id="file_' + item['id'] + '" class="file online" data="' + item['id'] + '">';
                    file += '<div class="file_attributes ' + item['protection'] + '" data="' + item['protection'] + '">';
                    file += item['ownership'];
                    file += '</div>';
                    file += '<div class="title" data="' + item['title'] + '">';
                    file += nameToTitle(item['title']);
                    file += '</div></div>';
                    files += file;
                });
                $("#files #location_online #file_library").append(files);
                callback(true);
            }
        );
    },
    githubRepos: function(callback) {
        $.post("server/php/locations/github_repos.php",
            function(json) {
                if(json == "Bad Token") {
                    window.documents.notification("Opps! Github Needs To Be <a href='/account?github=2'>Reauthorized</a>");
                    return false;
                }

                var repos = "";
                $.each(JSON.parse(json), function(i, item) {
                    repos += '<li>' + item['user'] + '/<span class="bold">' + item['repo'] + '</span></li>'
                });

                if(repos != "") {
                    $("#popup_location_github").append("<ul>" + repos + "</ul>");
                } else {
                    $("#popup_location_github #github_empty").show();
                }
                callback(true);
            }
        );
    },
    githubDirectory: function(location_id, path, callback) {
        window.documents.notification("loading...");
        $.post("server/php/locations/github_directory.php", { location_id: location_id, dir: path },
            function(json) {
                if(json == "Bad Token") {
                    window.documents.notification("Opps! Github Needs To Be <a href='/account?github=2'>Reauthorized</a>");
                    return false;
                }

                if(json == "Bad Location") {
                    window.documents.notification("Location Does Not Exist");
                    return false;
                }

                if(json == "Not Github Location") {
                    window.documents.notification("This Is Not A Github Location");
                    return false;
                }

                var files = "";
                $.each(JSON.parse(json), function(i, item) {
                    if(item["type"] == "file") { var type = "file"; var icon = "open"; var type_title = "file"; }
                    if(item["type"] == "dir") { var type = "folder"; var icon = "folder"; var type_title = "folder"; }
                    if(item["type"] == "back") { var type = "folder"; var icon = "back"; var type_title = "back"; }

                    var title = window.documents.nameToTitle(item["name"]);

                    var template = '<div location_id="github_' + item["path"] + '" class="file github" data="' + item["path"] + '">';
                    template += '<div class="file_attributes ' + icon + '" data="' + type + '">' + type_title + '</div>';
                    template += '<div class="title" data="' + item["name"] + '">' + title + '</div>';
                    template += '</div>';
                    files += template;
                });
                $("#files #location_template #file_library").html(files);
                window.documents.notificationClose();

                if(path != undefined && path != "") {
                    var dir = "&dir=" + path;
                }
                else {
                    var dir = "";
                }
                history.pushState(null, null, "?type=github&loc=" + location_id + dir);
                callback(true);
            }
        );
    },
    githubFile: function(location_id, path) {
        window.documents.notification("downloading");

        $.post("server/php/locations/github_file.php", { location_id: window.sidebar, file: path },
            function(contents) {
                if(contents == "Bad Location") {
                    window.documents.notification("Location Does Not Exist");
                    return false;
                }

                if(contents == "Not Github Location") {
                    window.documents.notification("This Is Not A Github Location");
                    return false;
                }

                $.post("server/php/session/new.php",
                    { session_name: file.parent().find(".title").attr("data"), session_document: JSON.stringify(contents.split('\n')),
                      session_type: "github", session_external_path:  path },
                    function(id) {
                        window.location.href = "editor?i=" + id;
                    }
                );
            }
        );
    },
    fileSearch: function(form) {
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
    },
    fileSearchClear: function(element) {
        element.parent("form").find('input:text, select').val('');
        element.parent("form").submit();
    }
}