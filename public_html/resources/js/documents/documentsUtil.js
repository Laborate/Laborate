/////////////////////////////////////////////////
//          Document Instances
/////////////////////////////////////////////////
window.documents = {
    popUp: function(preset, data) {
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
                window.documents.popUpClose();
            });
        }

        if(preset == "share_url") {
            $("#popup #share_url input[type=text]").val(data);
            $("#popup #share_url").show();
            $("#popup #popup_header #popup_header_name").text("Document Url");
            $("#popup").css({"width": "250"});
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
    contextMenu: function(element, e) {
        if($.trim(element.find(".file_attributes").text()) == "owner") { var action  = "Delete"; }
        else { var action = "Forget"; }

        $("#menu #action").text(action);

        if(($(window).width() - e.pageX) <= 130) { var left = e.pageX  - $("#menu").width(); }
        else { var left = e.pageX + 4; }

        $("#menu").css({"top": e.pageY + 16, "left": left}).attr("data", element.attr("data")).show();
    },
    contextMenuItem: function(element) {
        window.documents.contextMenuClose();
        var id = element.attr("id");
        var reference = $("#menu").attr("data");

        setTimeout(function() {
            if(id == "new") {
                window.documents.gotToTab("/editor/");
            }

            if(id == "tab") {
                window.documents.gotToTab("/editor/?i=" + reference);
            }

            if(id == "rename") {
                var name = prompt("File Name", $("#file_" + reference + " .title").attr("data"));
                if (name != null && name != "") {
                    var title = window.documents.nameToTitle(name);
                    $("#file_"+reference+" .title").attr("data", name);
                    $("#file_"+reference+" .title").text(title);

                    $.post("/php/session/rename.php", { session_id: reference, session_name: name});
                }
            }

            if(id == "action") {
                $.post("//php/session/actions.php", { session_id: reference});
                $("#file_" + reference).animate({"opacity": 0}, 500);
                setTimeout(function() {
                    $("#file_" + reference).remove();
                }, 600);
            }

            if(id == "share") {
                window.documents.popUp("share_url", location.protocol + '//' + location.host+ "/editor?i=" + reference);
            }

        }, 100);
    },
    contextMenuClose: function() {
       $("#menu").hide();
    },
    nameToTitle: function(name) {
        if(name.length > 11) { var title = name.substring(0, 10) + "..."; }
        else { var title = name; }
        return title;
    },
    locationChange: function(location_id, dont_pull_content) {
        $("#files .location").hide();
        $("#locations ul li").removeClass("selected");
        $("#" + location_id).addClass("selected");
        var type = $("#" + location_id).attr("data");

        if(location_id == "online" || location_id == undefined) {
            $("#online").addClass("selected");
            $("#files #location_online #file_library").html("");
            $("#files #location_online").show();
            location_id = "online";
            if(!dont_pull_content) {
                window.documents.onlineDirectory();
                window.notification.close();
            }
        } else {
           $("#files #location_template #file_library").html("");
           $("#files #location_template").show();
           if(!dont_pull_content) {
                if(type == "github") {
                   window.documents.githubDirectory(location_id);
                }
                else if(type == "sftp") {
                   window.documents.sftpDirectory(location_id);
                }
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
            var exceptions = ['popup_location_default', 'popup_location_username'];

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
                if($(this).val() == "" && $.inArray($(this).attr("id"), exceptions) == -1) {
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
                else if(type_icon == "sftp") { var icon = "icon-drawer"; }
                else { var icon = "icon-storage"; }
                var key = Math.floor((Math.random()*10000)+1);
                var li = '<li id="' + key +'" data="' + type_icon + '">';
                li += '<span class="icon ' + icon + '">';
                li += '</span>' + $("#popup #popup_location_name").val() + '</li>';
                $("#locations ul").append(li);
                window.documents.popUpClose();
                $.post("/php/user/update.php", { locations_add: [key, items] });
            }
            return false;
        });
    },
    removeLocation: function(element) {
        var id = element.attr("id");
        window.documents.popUp("location_delete");

        $("#popup #location_remove input[type=button]").live("click", function() {
            element.remove();

            if(window.sidebar == id) {
                window.documents.locationChange("online");
            }

            $.post("/php/user/update.php", { locations_remove: id });

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
    locationListing: function(callback) {
        $.post("/php/locations/locations_listing.php",
            function(json) {
                var locations = "";
                $.each(JSON.parse(json), function(i, item) {
                    locations += '<li id="' + item['key'] + '" data="' + item['type'] + '">';
                    locations += '<span class="icon ' + item['icon'] + '"></span>' + item['name'] + '</li>';
                });
                $("#locations ul").append(locations);

                if(callback == undefined) {
                    callback = function(){}
                }

                callback(true);
            }
        );
    },
    cachedLocations: function(location_id) {
        if(window.cachedLocations == undefined) {
           window.cachedLocations = new Array();
        }

        if(window.cachedLocations["location_" + location_id] == undefined) {
            window.cachedLocations["location_" + location_id] = new Array();
        }

        return window.cachedLocations["location_" + location_id];
    },
    addcachedLocation: function(location_id, path, json) {
        if(window.cachedLocations["location_" + location_id] == undefined) {
            window.cachedLocations["location_" + location_id] = {}
        }

        if(path == "" || path == undefined) {
            path = "";
        }

        window.cachedLocations["location_" + location_id][path] = json;
    },
    hasPopUpBlocker: function(poppedWindow) {
        var result = false;
        try {
            if (typeof poppedWindow == 'undefined') {
                result = true;
            }
            else if (poppedWindow && poppedWindow.closed) {
                result = false;
            }
            else if (poppedWindow && poppedWindow.test) {
                result = false;
            }
            else {
                result = true;
            }

        } catch (err) {}
        return result;
    },
    gotToLink: function(link) {
        window.location.href = link;
    },
    gotToTab: function(link) {
        var tab = window.open(link);
        if (!window.documents.hasPopUpBlocke(tab)) {
            window.documents.gotToTab(link);
        }
    },
    newFile: function(name, data, type, path, location_id, callback) {
        $.post("/php/session/new.php",
            {   session_name: name, session_document: data,
                session_type: type, session_external_path:  path,
                session_location_id: location_id },
            function(id) {
                callback(id);
            }
        );
    },
    onlineDirectory: function(no_history, callback) {
        window.notification.open("loading...");
        $.post("/php/locations/online_directory.php",
            function(json) {
                var files = "";
                var type_convert = {"github":"icon-github", "sftp":"icon-drawer"};
                $.each(JSON.parse(json), function(i, item) {
                    var file = '<div id="file_' + item['id'] + '" class="file online" data="' + item['id'] + '">';
                    file += '<div class="file_attributes icon ' + item['protection'] + '" data="' + item['protection'] + '">';
                    if(item['type'] != "" && item['type'] != undefined) {
                        file += '<div class="file_badge ' + type_convert[item['type']] + '"></div>';
                    }
                    file += item['ownership'];
                    file += '</div>';
                    file += '<div class="title" data="' + item['name'] + '">';
                    file += window.documents.nameToTitle(item['name']);
                    file += '</div></div>';
                    files += file;
                });

                $("#files #location_online #file_library").append(files);

                if(callback == undefined) {
                    callback = function(){}
                }

                window.notification.close();
                if(!no_history) {
                    history.pushState(null, null, "/documents/");
                }
                callback(true);
            }
        );
    },
    githubRepos: function(callback) {
        $.post("/php/locations/github_repos.php",
            function(json) {
                if(json == "Bad Token") {
                    window.notification.open("Opps! Github Needs To Be <a href='/account?github=2'>Reauthorized</a>");
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

                if(callback == undefined) {
                    callback = function(){}
                }

                callback(true);
            }
        );
    },
    githubDirectory: function(location_id, path, no_history, callback) {
        window.notification.open("loading...");
        var response = window.documents.cachedLocations(location_id);
        var files = "";

        if(path == undefined || path == "" || path == "/") {
            var dir = "";
            path = "";
        }
        else {
            var dir = "&dir=" + path;
        }

        if(response[path] != undefined) {
            finish(response[path]);
        } else {
            $.post("/php/locations/github_directory.php", { location_id: location_id, dir: path },
                function(json) {
                    if(json == "Bad Token") {
                        window.notification.open("Opps! Github Needs To Be <a href='/account?github=2'>Reauthorized</a>");
                        return false;
                    }

                    if(json == "Bad Location") {
                        window.notification.open("Location Does Not Exist");
                        return false;
                    }

                    if(json == "Not Github Location") {
                        window.notification.open("This Is Not A Github Location");
                        return false;
                    }

                    window.documents.addcachedLocation(location_id, path, json);
                    finish(json);
                }
            );
        }

        function finish(response) {
            $.each(JSON.parse(response), function(i, item) {
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
            window.notification.close();

            if(no_history != true) {
                history.pushState(null, null, "?type=github&loc=" + location_id + dir);
            }

            if(callback == undefined) {
                callback = function(){}
            }

            callback(true);
        }
    },
    githubFile: function(location_id, file) {
        var path = file.parent().attr("data");
        window.notification.open("downloading...");

        $.post("/php/locations/github_file.php", { location_id: location_id, file: path },
            function(contents) {
                if(contents == "Bad Token") {
                    window.notification.open("File Does Not Exist");
                    return false;
                }

                if(contents == "Bad Location") {
                    window.notification.open("Location Does Not Exist");
                    return false;
                }

                if(contents == "Not Github Location") {
                    window.notification.open("This Is Not A Github Location");
                    return false;
                }

                window.documents.newFile(file.parent().find(".title").attr("data"),
                                         JSON.stringify(contents.split('\n')),
                                         "github", path, location_id,
                     function(id) {
                         window.documents.gotToTab("/editor/?i=" + id);
                         window.notification.close();
                     }
                );
            }
        );
    },
    sftpDirectory: function(location_id, path, no_history, callback) {
        window.notification.open("loading...");
        var response = window.documents.cachedLocations(location_id);
        var files = "";

        if(path == undefined || path == "") {
            var dir = "";
            path = "";
        }
        else {
            var dir = "&dir=" + path;
        }

        if(response[path] != undefined) {
            finish(response[path]);
        } else {
            $.post("/php/locations/sftp_directory.php", { location_id: location_id, dir: path },
                function(json) {
                    if(json == "Bad Credentials") {
                        window.notification.open("Bad SFTP Credentials");
                        return false;
                    }

                    if(json == "Bad Location") {
                        window.notification.open("Location Does Not Exist");
                        return false;
                    }

                    if(json == "Not SFTP Location") {
                        window.notification.open("This Is Not A SFTP Location");
                        return false;
                    }

                    window.documents.addcachedLocation(location_id, path, json);
                    finish(json);
                }
            );
        }

        function finish(response) {
            $.each(JSON.parse(response), function(i, item) {
                if(item["type"] == "file") { var type = "file"; var icon = "open"; var type_title = "file"; }
                if(item["type"] == "dir") { var type = "folder"; var icon = "folder"; var type_title = "folder"; }
                if(item["type"] == "back") { var type = "folder"; var icon = "back"; var type_title = "back"; }

                var title = window.documents.nameToTitle(item["name"]);

                if(item["path"] != null) {
                    var template = '<div location_id="sftp_' + item["path"] + '" class="file sftp" data="' + item["path"] + '">';
                    template += '<div class="file_attributes ' + icon + '" data="' + type + '">' + type_title + '</div>';
                    template += '<div class="title" data="' + item["name"] + '">' + title + '</div>';
                    template += '</div>';
                    files += template;
                }
            });
            $("#files #location_template #file_library").html(files);
            window.notification.close();

            if(!no_history) {
                history.pushState(null, null, "?type=sftp&loc=" + location_id + dir);
            }

            if(callback == undefined) {
                callback = function(){}
            }

            callback(true);
        }
    },
    sftpFile: function(location_id, file) {
        var path = file.parent(".file").attr("data");
        window.notification.open("downloading...");

        $.post("/php/locations/sftp_file.php", { location_id: location_id, file: path },
            function(json) {
                if(json == "Bad Credentials") {
                    window.notification.open("Bad SFTP Credentials");
                    return false;
                }

                if(json == "Bad Location") {
                    window.notification.open("Location Does Not Exist");
                    return false;
                }

                if(json == "Not SFTP Location") {
                    window.notification.open("This Is Not A SFTP Location");
                    return false;
                }

                window.documents.newFile(file.parent().find(".title").attr("data"),
                                         JSON.stringify(json.split('\n')),
                                         "sftp", path, location_id,
                     function(id) {
                         window.documents.gotToTab("/editor/?i=" + id);
                         window.notification.close();
                     }
                );
            }
        );
    },
    fileSearch: function(form) {
        var search = form.find("input[name=s]").val();
        var protection = form.find("select[name=p]").val();
        var relation = form.find("select[name=r]").val();
        var parent_location = form.parent(".location");

        parent_location.find(".file").each(function() {
            var show = true;
            if($(this).find(".title").text().toLowerCase().indexOf(search) < 0) { show = false; }
            if(window.sidebar == "online") {
                if(protection != $(this).find(".file_attributes").attr("data")[0] && protection != "") { show = false; }
                if(relation != $.trim($(this).find(".file_attributes").text())[0] && relation != "") { show = false; }
            }
            if(show) { $(this).show(); } else { $(this).hide(); }
        });

        if(parent_location.find(".file:visible").length == 0 && parent_location.find(".file").length != 0) {
            $(".location:visible .notFound").show();
            if($(window).width() < 950) {
                parent_location.find("#newFile").hide();
                parent_location.find("#clearSearch").css("float","right");
            }
            else {
                parent_location.find("#newFile").show();
                parent_location.find("#clearSearch").css("float","left");
            }

            parent_location.find("#clearSearch").show();

        } else {
            parent_location.find(".notFound").hide();
            parent_location.find("#clearSearch").hide();
            parent_location.find("#newFile").show();
        }
    },
    fileSearchClear: function(element) {
        element.parent("form").find('input:text, select').val('');
        element.parent("form").submit();
    }
}