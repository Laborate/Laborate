/////////////////////////////////////////////////
//          Document Instances
/////////////////////////////////////////////////
window.documents = {
    popUp: function(preset, data) {
        //Inital Clean Up
        $("#popup .presets").hide();
        $("#popup .selection").hide();
        $("#popup .input, #popUp .select").val('').css({"border":""});
        $("#popup .selected").removeClass("selected");

        //Cycle Through Presets
        if(preset == "location_add") {
            $("#popup #location_add").show();
            $("#popup #location_add .selection").eq(0).show();
            $("#popup #popup_header #popup_header_name").text("New Location");
            $("#popup #location_add .select").val($("#popup #location_add .select option:first").val());
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
            $("#popup #popup_header #popup_header_name").text("Share Url");
            $("#popup").css({"width": "250"});
        }

        if(preset == "rename") {
            $("#popup #rename input[type=text]").val(data).css({"border":""});
            $("#popup #rename").show();
            $("#popup #rename .selection").show();
            $("#popup #popup_header #popup_header_name").text("Rename Document");
            $("#popup").css({"width": "250"});
        }

        //Auto Center And Show
        $("#popup").hAlign().vAlign().show();
        $("#popup_backdrop").show();
    },
    popUpClose: function() {
        //Remove Live Events From Forms
        $("#popup *").die();

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
                window.documents.goToTab("/editor/");
            }

            if(id == "tab") {
                window.documents.goToTab("/editor/?i=" + reference);
            }

            if(id == "rename") {
                window.documents.popUp("rename", $("#file_" + reference + " .title").attr("data"));
                $("#popup #rename form").live("submit", function() {
                    var name = $("#popup #rename input[type=text]").val();
                    if (name != null && name != "") {
                        $("#file_"+reference+" .title").attr("data", name);
                        $("#file_"+reference+" .title").text(name);
                        window.documents.popUpClose();
                        $.post("/php/session/rename.php", { session_id: reference, session_name: name});
                    } else {
                        $("#popup #rename input[type=text]").css({"border":"solid thin #CC352D"});
                    }

                    return false;

                });
            }

            if(id == "action") {
                $.post("/php/session/actions.php", { session_id: reference});
                $("#file_" + reference).animate({"opacity": 0}, 500);
                setTimeout(function() {
                    $("#file_" + reference).remove();
                }, 600);
            }

            if(id == "share") {
                window.documents.popUp("share_url", location.protocol + '//' + location.host+ "/editor/?i=" + reference);
            }

        }, 100);
    },
    contextMenuClose: function() {
       $("#menu").hide();
    },
    locationChange: function(location_id, path, no_history) {
        $("#files .location").hide();
        $("#locations ul li").removeClass("selected");
        $("#" + location_id).addClass("selected");

        if(location_id == "online" || !location_id) {
            $("#online").addClass("selected");
            $("#files #location_online #file_library").html("");
            $("#files #location_online").show();
            location_id = "online";
            window.documents.onlineDirectory(no_history);
        } else {
           $("#files #location_template #file_library").html("");
           $("#files #location_template").show();
           window.documents.locationDirectory(location_id, path, no_history);
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
            if($("#popup #popup_location_name").val() == $("#popup #popup_location_github .selected").text()) {
                $("#popup #popup_location_name").val($(this).text());
            }

            $("#popup #popup_location_github ul li").removeClass("selected");
            $(this).addClass("selected");
        });

        //Check For Form Submit
        $("#popup #location_add form").live("submit", function() {
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
                $("#popup #popup_location_type").die();
                $("#popup #popup_location_github ul li").die();
                $("#popup #location_add form").die();
                $.post("/documents/location/create/", { locations_add: [Math.floor((Math.random()*10000)+1), items] },
                    function() {
                        window.documents.locationListing();
                });
                window.documents.popUpClose();
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

            $.post("/documents/location/remove/", { locations_remove: id });

            if($("#locations.remove ul li").size() == 1) {
                $("#locations").removeClass("remove");
                $("#locations #online").toggle().addClass("selected");
                $("#popup #location_remove input[type=button]").die();
            }
        });
    },
    toggleRemoveMode: function() {
        $("#locations").toggleClass("remove");
        $("#locations #online").toggle();
    },
    locationListing: function(location) {
        $.get("/documents/locations/",
            function(json) {
                var locations = "";
                $.each(json, function(i, item) {
                    if(item["type"] == "github") { var icon = "icon-github"; }
                    else if(item["type"] == "sftp") { var icon = "icon-drawer"; }
                    else { var icon = "icon-storage"; }
                    locations += '<li id="' + item['key'] + '" data="' + item['type'] + '">';
                    locations += '<span class="icon ' + icon + '"></span>';
                    locations += '<span class="location_name">' + item['name'] + '</span></li>';
                });
                $("#locations ul li").not("li[id='online']").remove();
                $("#locations ul").append(locations);
                $("#" + location).addClass("selected");
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
    goToLink: function(link) {
        window.location.href = link;
    },
    goToTab: function(link) {
        if(!window.open(link)) {
            window.location.href = link;
        }
    },
    newFile: function(name, data, type, path, location_id, callback) {
        $.post("/php/session/new.php",
            {   session_name: name, session_document: data,
                session_type: type, session_external_path:  path,
                session_location_id: location_id },
            function(id) {
                if(callback) callback(id);
            }
        );
    },
    onlineDirectory: function(no_history) {
        window.notification.open("loading...");
        $.get("/documents/files/", function(json) {
            if("error_message" in json) {
                window.notification.open(json.error_message);

            } else {
                var files = "";
                $.each(json, function(i, item) {
                    var protection = (item['password']) ? "password" : "open";
                    var location = (item['location']) ? item['location'] : "";
                    var file = '<div id="file_' + item['id'] + '" class="file online" data="' + item['id'] + '">';
                    file += '<div class="file_attributes icon ' + protection + '" data="' + location + '">';
                    file += item['role'].toLowerCase();
                    file += '</div>';
                    file += '<div class="title" data="' + item['name'] + '">' + item['name'] + '</div></div>';
                    files += file;
                });

                $("#files #location_online #file_library").append(files);

                window.notification.close();
                if(!no_history) history.pushState(null, null, "/documents/");
            }
        });
    },
    githubRepos: function() {
        $.get("/github/repos/", function(json) {
            if("error_message" in json) {
                    if(json.error_message == "Bad Github Oauth Token") {
                        window.notification.open("Opps! Github Needs To Be <a href='" + json.github_oath + "'>Reauthorized</a>");
                    } else {
                        window.notification.open(json.error_message);
                    }

                } else {
                    var repos = "";
                    $.each(json, function(i, item) {
                        repos += '<li>' + item['user'] + '/<span class="bold">' + item['repo'] + '</span></li>'
                    });

                    if(repos) {
                        $("#popup_location_github").append("<ul>" + repos + "</ul>");
                    } else {
                        $("#popup_location_github #github_empty").show();
                    }
                }
        });
    },
    locationDirectory: function(location_id, path, no_history) {
        window.notification.open("loading...");
        var response = window.documents.cachedLocations(location_id);
        var files = "";

        if(path == undefined || path == "/") {
            path = "";
        }

        if(response[path] != undefined) {
            finish(response[path]);
        } else {
            $.get("/documents/location/" + location_id + "/" + path,
                function(json) {
                    if("error_message" in json) {
                        if(json.error_message == "Bad Github Oauth Token") {
                            window.notification.open("Opps! Github Needs To Be <a href='" + json.github_oath + "'>Reauthorized</a>");
                        } else {
                            window.notification.open(json.error_message);
                        }

                    } else {
                        window.documents.addcachedLocation(location_id, path, json);
                        finish(json);
                    }
                }
            );
        }

        function finish(response) {
            $.each(response, function(i, item) {
                if(item["type"] == "file") { var type = "file"; var icon = "open"; var type_title = "file"; }
                if(item["type"] == "dir") { var type = "folder"; var icon = "folder"; var type_title = "folder"; }
                if(item["type"] == "symlink") { var type = "folder"; var icon = "folder"; var type_title = "symlink"; }
                if(item["type"] == "back") { var type = "folder"; var icon = "back"; var type_title = "back"; }

                var template = '<div class="file external" data="' + item["path"] + '">';
                template += '<div class="file_attributes ' + icon + '" data="' + type + '">' + type_title + '</div>';
                template += '<div class="title" data="' + item["name"] + '">' + item["name"] + '</div>';
                template += '</div>';
                files += template;
            });
            $("#files #location_template #file_library").html(files);
            window.notification.close();
            path = (path.substr(-1) != '/' && path) ? path + "/" : path;
            if(!no_history) history.pushState(null, null, "/documents/location/" + location_id + "/" + path);
        }
    },
    locationFile: function(location_id, file) {
        var path = file.parent().attr("data");
        window.notification.open("downloading...");

        $.post("/php/locations/github_file.php", { location_id: location_id, file: path },
            function(contents) {
                if(contents == "Bad Token") {
                    window.notification.open("File Does Not Exist");
                    return false;
                }

                if(contents == "Bad Location" || contents == "Not Github Location") {
                    window.notification.open("Location Does Not Exist");
                    return false;
                }

                window.documents.newFile(file.parent().find(".title").attr("data"),
                                         JSON.stringify(contents.split('\n')),
                                         "github", path, location_id,
                     function(id) {
                         window.documents.goToLink("/editor/?i=" + id);
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
            if($(this).find(".title").attr("data").toLowerCase().indexOf(search) < 0) { show = false; }
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
