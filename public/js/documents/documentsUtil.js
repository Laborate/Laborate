/////////////////////////////////////////////////
//          Document Instances
/////////////////////////////////////////////////
window.documents = {
    mode: new Array(),
    locationActivated: null,
    locationIcons: {},
    headerBarPrevious: null,
    headerBarPreviousDouble: null,
    terminalActive: null,
    timer: null,
    uploadFiles: [],
    popup: function(action, data, header) {
        var container = $(".popup .container");
        var new_css = {};
        var show = true;
        var params = window.url_params(true);

        container
            .attr("style", "")
            .find(".action")
            .hide()
            .find("input")
            .not("[type='file'], .keep")
            .val("")
            .removeClass("error");

        container
            .find(".header .download")
            .hide();

        container
            .find("#popup-" + action)
            .show();

        switch(action) {
            case "add-location":
                new_css.width = "300px";
                new_css.height = "350px";

                if(data) container
                    .find("#popup-" + action)
                    .find(".listing")
                    .html(data);
                break;
            case "add-location-sftp":
                new_css.width = "300px";
                new_css.height = "370px";

                if(data) container
                    .find("#popup-" + action)
                    .find("input[name='location[name]']")
                    .val(data);
                break;

            case "create":
                new_css.width = "250px";
                new_css.height = "142px";

                container
                    .find("#popup-" + action)
                    .find("input[name=location]")
                    .val(params.location)
                    .parents("#popup-" + action)
                    .find("input[name=path]")
                    .val(params.dir);
                break;

            case "rename":
                new_css.width = "250px";
                new_css.height = "142px";

                container
                    .find("#popup-" + action)
                    .find("form")
                    .attr("action", "/documents/file/" + data.id + "/rename/")
                    .find("input")
                    .val(data.name);
                break;

            case "url":
                new_css.width = "300px";
                new_css.height = "100px";

                container
                    .find("#popup-" + action)
                    .find("input")
                    .val(window.config.host + "/editor/" + data + "/");
                break;

            case "widget":
                new_css.width = "500px";
                new_css.height = "265px";

                container
                    .find("#popup-" + action)
                    .find("textarea")
                    .val(data);
                break;

            case "upload":
                new_css.width = "300px";
                new_css.height = "305px";

                container
                    .find("#popup-" + action)
                    .find("input[name=location]")
                    .val(params.location)
                    .parents("#popup-" + action)
                    .find("input[name=path]")
                    .val(params.dir)
                    .parents("#popup-" + action)
                    .find(".listing")
                    .html(function() {
                        return $.map(data, function(item) {
                            return $('                                                               \
                                <div class="item">                                                   \
                                    <div class="left icon ' + config.icons.file_small + '"></div>    \
                                    <div class="name">' + item.name + '</div>                        \
                                </div>                                                               \
                            ').attr(function() {
                                var attributes = {};
                                $.each(item, function(key, value) {
                                    if(typeof value != "function") {
                                        attributes["data-" + key] = value;
                                    }
                                })
                                return attributes;
                            }());
                        });
                    }());
                break;

            case "image":
                new_css.width = "300px";
                new_css.height = "150px";
                new_css.background = "url('/img/transparent.gif') repeat";

                container
                    .find(".header .download")
                    .show();

                container
                    .find("#popup-" + action)
                    .find("img")
                    .attr("src", data)
                    .css("visibility", "hidden")
                    .load(function() {
                        container
                            .css({
                                "width": "",
                                "height": ""
                            })
                            .hAlign("fixed")
                            .vAlign("fixed")
                            .find("#popup-" + action)
                            .find("img")
                            .css("visibility", "");
                    });

                break;

            default:
                show = false;
                break;
        }

        if(header) {
            container
                .find(".header .title")
                .text(header)
                .parent(".header")
                .toggle(!!(header));
        }

        container
            .css(new_css)
            .hAlign("fixed")
            .vAlign("fixed")
            .parent(".popup")
            .toggle(show);
    },
    popupSubmit: function(form) {
        var passed = true;
        var data = new FormData(form[0]);
        var submit =  form.find("button[type=submit]");

        data.append("_csrf", window.config.csrf);

        if(!submit.attr("data-original")) submit.attr("data-original", submit.text());
        if(window.documents.timer) clearInterval(window.documents.timer);

        form.find("input").each(function() {
            if($(this).data("required") && $(this).val() == "") {
                passed = false;
                $(this).addClass("error");
            } else {
                $(this).removeClass("error");
            }
        });

        form.find(".list").each(function() {
            var list = $(this).removeClass("error");
            if(list.find(".item").hasClass("active")) {
                $.each(list.find(".item.active").data(), function(key, value) {
                    if(list.data("name") != "next") {
                        data.append(list.data("name") + "[" + key + "]",  value);
                    }
                });
            } else {
                if(list.data("required")) {
                    list.addClass("error");
                    passed = false;
                }
            }
        });

        if(passed) {
            submit.text("loading...").addClass("disabled");

            $.ajax({
                url: form.attr("action"),
                type: 'POST',
                data: data,
                cache: false,
                contentType: false,
                processData: false
            }, 'json').done(function(result) {
                if(result.success) {
                    window.documents.popup("close");
                    submit.text(submit.attr("data-original"));
                    if(form.data("callback")) window.documents[form.data("callback")](result);
                } else {
                    submit
                        .text(result.error_message)
                        .removeClass("disabled")
                        .addClass("error");

                    window.documents.timer = setTimeout(function() {
                        submit
                            .text(submit.attr("data-original"))
                            .removeClass("error");
                    }, 5000);
                }
            });
        }
    },
    popupUpload: function() {
        $(".popup #popup-upload input[type='file']")
            .click(function() {
                $(this).unbind('change');
            })
            .click()
            .change(function(event) {
                if($(this)[0].files.length != 0) {
                    var files = $.map($(this)[0].files, function(item) {
                        if((item.type == "" || item.type.match(/(?:text|json)/)) && item.size < 1024 * 2000) {
                            return item;
                        }
                    });

                    if(files.length != 0) window.documents.popup("upload", files, "Upload Files (2mb limit)");
                }
            });
    },
    popupAddLocation: function(element) {
        var list = [],
            update = true,
            listing = $("#popup-add-location .list"),
            name = $("#popup-add-location input[name='location[name]']");

        listing.removeClass("error");
        name.removeClass("error");

        switch(element.data("next")) {
            case "sftp":
                window.documents.popup("add-location-sftp", name.val(), "Add Location");
                break;
            case "github":
                list = window.documents.repoListing("github");
                break;

            case "bitbucket":
                list = window.documents.repoListing("bitbucket");
                break;

            case "repo-option":
                update = false;

                if(!name.val() || (name.val() == element.siblings(".active").data("repository"))) {
                    name.val(element.data("repository"));
                }

                element.siblings().removeClass("active");
                element.addClass("active");
                break;

            case "link":
                var name = element.parents(".actions").find("#location-name");
                if(element.data("name-required") && name.val()) {
                    window.location.href = element.attr("data-link") + encodeURI(name.val()) + "/";
                } else {
                    if(!element.data("name-required")) {
                         window.location.href = element.attr("data-link");
                    } else {
                        name.addClass("error");
                    }
                }
                break;

            default:
                $.each(window.config.apps, function(key, value) {
                    var add_icon =  ("green " + config.icons.add_circle);
                    var arrow_icon = ("blue " + config.icons.circle_arrow_up);


                    if(key == "sftp" && value.show) {
                        list.push({
                            "name": "SFTP Server",
                            "icon": config.icons.sftp,
                            "class": "selectable",
                            "data": {
                                "data-next": "sftp"
                            },
                            "notification": arrow_icon
                        });
                    } else if(key == "github" && value.show) {
                        list.push({
                            "name": "Github Repository",
                            "icon": config.icons.github,
                            "class": "selectable",
                            "data": {
                                "data-next": (value.enabled) ? "github" : "link",
                                "data-link": value.link,
                            },
                            "notification": (!value.enabled) ? add_icon : arrow_icon
                        });
                    } else if(key == "bitbucket" && value.show) {
                        list.push({
                            "name": "Bitbucket Repository",
                            "icon": config.icons.bitbucket,
                            "class": "selectable",
                            "data": {
                                "data-next": (value.enabled) ? "bitbucket" : "link",
                                "data-link": value.link
                            },
                            "notification": (!value.enabled) ? add_icon : arrow_icon
                        });
                    } else if(key == "dropbox" && value.show) {
                        list.push({
                            "name": "Dropbox Account",
                            "icon": config.icons.dropbox,
                            "class": "selectable",
                            "data": {
                                "data-next": (value.enabled) ? "dropbox" : "link",
                                "data-link": value.link,
                                "data-name-required": "true"
                            },
                            "notification": (!value.enabled) ? add_icon : arrow_icon
                        });
                    } else if(key == "google" && value.show) {
                        list.push({
                            "name": "Google Drive Account",
                            "icon": config.icons.google,
                            "class": "selectable",
                            "data": {
                                "data-next": (value.enabled) ? "drive" : "link",
                                "data-link": value.link,
                                "data-name-required": "true"
                            },
                            "notification": (!value.enabled) ? add_icon : arrow_icon
                        });
                    }
                });

                break;
        }

        if(update && list.length != 0) {
            window.documents.popup("add-location", $.map(list, function(item) {
                return $('                                                              \
                    <div class="item ' + item.class + '">                               \
                        <div class="icon ' + item.icon + '"></div>                      \
                        <div class="name">' + item.name + '</div>                       \
                        <div class="notification ' + item["notification"]  + '"></div>  \
                    </div>                                                              \
                ').attr(item.data);
            }), "Add Location");
        }
    },
    popupWidget: function(file) {
        $(".popup").attr("data-file", file.attr("data-id"));
        window.documents.popupWidgetChange($("#popup-widget .sizes .item").eq(1));
    },
    popupWidgetChange: function(size) {
        window.debug = size;
        $("#popup-widget .sizes .item").removeClass("active");
        size.addClass("active");

        window.documents.popupWidgetResult(
            $(".popup").attr("data-file"),
            size.find("input[name=width]").val(),
            size.find("input[name=height]").val()
        );
    },
    popupWidgetResult: function(id, width, height) {
         window.documents.popup("widget", $('                                  \
            <iframe src="' + window.config.host + '/editor/' + id + '/embed/"  \
                    width="' + width + '"                                      \
                    height="' + height + '"                                    \
                    frameborder="0"></iframe>                                  \
        ').prop('outerHTML'), "Widget Embed (view only)");
    },
    contextMenu: function(element) {
        var menu = element.parent(".context-menu");
        var file = $(".pane .file[data-id='" + menu.attr("data-id") + "']");

        switch(element.data("action")) {
            case "rename":
                window.documents.popup("rename", {
                    "id": file.attr("data-id"),
                    "name": file.attr("data-name")
                }, "Rename File");
                break;
            case "remove":
                $.post("/documents/file/" + file.attr("data-id") + "/remove/", {
                    _csrf: window.config.csrf
                }, function(json) {
                    if(json.success == false) {
                        window.documents.headerBar(["message"], json.error_message);
                    } else {
                        file.css({ "opacity": 0 });
                        setTimeout(function() {
                            file.remove();
                        }, 300);
                    }

                });
                break;

            case "private":
                if(file.attr("data-role") === "owner") {
                    $.post("/documents/file/" + file.attr("data-id") + "/private/", {
                        _csrf: window.config.csrf,
                        private: file.attr("data-private") !== "true"
                    }, function(json) {
                        if(json.success == false) {
                            window.documents.headerBar(["message"], json.error_message);
                        } else {
                            file
                                .attr("data-private", json.private)
                                .find(".corner")
                                .toggleClass(config.icons.locked, json.private);
                        }
                    });
                }

                break;

            case "url":
                window.documents.popup("url", file.data("id"), "Share Url");
                break;

            case "widget":
                window.documents.popupWidget(file);
                break;
        }
    },
    contextMenuOpen: function(element, event) {
        $(".context-menu-open")
            .attr("href", "/editor/" + element.data("id") + "/");

        $("#context-menu-remove").text(function() {
            if(element.attr("data-role") == "owner") {
                return "Delete";
            } else {
                return "Forget";
            }
        }());

        $("#context-menu-private").text(function() {
            if(element.attr("data-private") === "true") {
                return "Make Public";
            } else {
                return "Make Private";
            }
        }());

        $("#context-menu-private").toggle(element.attr("data-role") === "owner");
        $("#context-menu-url").toggle(element.attr("data-private") === "false");
        $("#context-menu-widget").toggle(element.attr("data-private") === "false");

        $(".context-menu")
            .css({
                "top": function() {
                    if(($(window).height() - event.pageY) <= 150) {
                        return event.pageY  - $(".context-menu").height();
                    } else {
                        return event.pageY + 16;
                    }
                }(),
                "left": function() {
                    if(($(window).width() - event.pageX) <= 150) {
                        return event.pageX  - $(".context-menu").width();
                    } else {
                        return event.pageX + 4;
                    }
                }()
            })
            .attr({
                "data-id": element.attr("data-id")
            })
            .show();
    },
    contextMenuClose: function() {
        $(".context-menu").hide();
    },
    headerBar: function(action, message, permanent) {
        $(".subheader > div:not(.clear)").hide();
        $(".subheader .filter").hide();
        $(".subheader .filter select").val("add filter");
        window.documents.mode = [];

        $.each(action, function(i, item) {
            switch(item) {
                case "message":
                    window.documents.popup("close");
                    $(".subheader .message").html(message).show();

                    if(window.documents.headerBarPrevious && !permanent) {
                        setTimeout(function() {
                            window.documents.headerBar(window.documents.headerBarPrevious);
                        }, 3000);
                    }

                    break;
                case "filters-online":
                    $(".subheader .filters, .subheader .filter[data-type='online']").show();
                    break;
                case "filters-non-online":
                    $(".subheader .filters, .subheader .filter[data-type='non-online']").show();
                    break;
                case "add":
                    $(".subheader .add-files").show();
                    break;
                case "download":
                    $(".subheader .download-files").show();
                    break;
                case "terminal":
                    $(".subheader .terminal-button").show();
                    break;
                case "side-button":
                    $(".side-button").show();
                    break
            }
        });

        if(action.indexOf("message") == -1) {
            window.documents.headerBarPreviousDouble = window.documents.headerBarPrevious;
            window.documents.headerBarPrevious = action;
        }
    },
    locations: function(callback) {
        $.get("/documents/locations/", function(json) {
            if(json.success == false) {
                window.documents.headerBar(["message"], json.error_message);
            }

            var locations = ('                                                \
                <div class="option" data-key="online" data-counter="0">       \
                    <div class="icon ' + config.icons.online + '"></div>      \
                    <div class="name">Your Drive</div>                        \
                </div>                                                        \
            ');


            $.each(json, function(i, item) {
                locations += ('                                                         \
                    <div class="option"                                                 \
                        data-key="' + item.key + '"                                     \
                        data-name="' + item.name + '"                                   \
                        data-type="' + item.type + '"                                   \
                        data-counter="0">                                               \
                        <div class="icon ' + config.icons[item.type] + '"></div>        \
                        <div class="name">' + item.name + '</div>                       \
                    </div>                                                              \
                ');
            });

            $(".sidebar .options .option").not("[data-key='online']").remove();
            $(".sidebar .options").html(locations);
            if(typeof callback == "function") {
                callback();
            }

            var interval = setInterval(function() {
                if(window.documents.locationActivated) {
                    var location = $(".options .option[data-key='" + window.documents.locationActivated + "']")
                        .addClass("activated");

                    if(window.documents.locationActivated != "online") {
                        $("title").text(location.attr("data-name") + window.config.delimeter + window.config.title);
                    }

                    clearInterval(interval);
                }
            }, 100);
        });
    },
    location: function(location, path, history, override) {
        $(".sidebar .info").text("");
        $(".options .option").removeClass("activated");
        var location_element = $(".options .option[data-key='" + location + "']").addClass("activated");
        if(location != window.url_params()["location"] || path != window.url_params()["dir"]) {
            $(".pane").html("");
        }

        if(window.documents.interval) clearTimeout(window.documents.timer);

        if(!location || ["popup", "search", "online"].indexOf(location) != -1) {
            $("title").text(window.config.title);
            if(location == "popup") {
                window.documents.mode = null;
                window.history.pushState(null, null, "/documents/");

                switch(path) {
                    case "add/document/":
                        window.documents.popup("create", false, "Create File");
                        break;
                    case "add/location/":
                        window.documents.popupAddLocation($(".popup"));
                        break;
                }

                window.documents.onlineDirectory(history);
            } else if(location == "search") {
                window.documents.onlineDirectory(history, true);
                var interval = setInterval(function() {
                    if(window.documents.locationActivated) {
                        window.documents.mode = null;
                        window.history.pushState(null, null, "/documents/");
                        clearInterval(interval);
                        $("#search input")
                            .val(decodeURI(path.substring(0, path.length - 1)))
                            .parents("form")
                            .submit();
                    }
                }, 100);
            } else {
                window.documents.onlineDirectory(history);
            }
        } else {
            if(location_element.length != 0) {
                $("title").text(location_element.attr("data-name") + window.config.delimeter + window.config.title);
            }

            window.documents.locationDirectory(location, path, history, location_element.attr("data-type"), override);
        }
    },
    locationReload: function() {
        if(window.navigator.onLine) {
            window.socketUtil.pageTrack();
            if(window.documents.locationActivated && window.documents.mode.length == 0) {
                window.documents.locations();
                window.documents.location(window.url_params()["location"], window.url_params()["dir"], false, true);
            }
        }
    },
    cachedLocations: function(location) {
        if(window.cachedLocations == undefined) {
           window.cachedLocations = new Array();
        }

        if(window.cachedLocations["location_" + location] == undefined) {
            window.cachedLocations["location_" + location] = new Array();
        }

        return window.cachedLocations["location_" + location];
    },
    addcachedLocation: function(location, path, json) {
        if(window.cachedLocations["location_" + location] == undefined) {
            window.cachedLocations["location_" + location] = {}
        }

        if(path == "" || path == undefined) {
            path = "";
        }

        window.cachedLocations["location_" + location][path] = json;
    },
    repoListing: function(type) {
        var json = $.ajax({
            type: "GET",
            url: "/" + type + "/repos/",
            async: false,
        }).responseJSON;

        if(json.success == false) {
            if(json.error_message == "Bad " + type.capitalize + " Oauth Token") {
                window.documents.headerBar(["message"],
                    "Opps! " + type.capitalize + " Needs To Be <a href='" + config.apps[type].link + "'>Reauthorized</a>", true);
            } else {
                window.documents.headerBar(["message"], json.error_message);
            }
        } else {
            return $.map(json.repos, function(item) {
                return {
                    "name": item.user + "/<strong>" + item.repo + "</strong>",
                    "icon": (item.private) ? config.icons.locked : config.icons.unlocked,
                    "class": "selectable",
                    "data": {
                        "data-repo": item.repo,
                        "data-repository": item.user + "/" + item.repo,
                        "data-branch": item.branch,
                        "data-next": "repo-option",
                        "data-type": type
                    }
                }
            });
        }
    },
    onlineDirectory: function(history, hide) {
        window.documents.headerBar(["filters-online", "add"]);

        window.documents.timer = setTimeout(function() {
            window.documents.headerBar(["message"], "downloading directory listing...", true);
        }, 5000);

        $.get("/documents/files/", function(json) {
            if(json.success == false) {
                window.documents.headerBar(["message"], json.error_message);
            } else {
                clearTimeout(window.documents.timer);
                window.documents.headerBar(["filters-online", "add"]);

                var files = "";
                $.each(json, function(i, item) {
                    window.documents.fileParser(item, true);

                    files += ('                                                       \
                        <div class="item ' + item.class + " " + item.color + '"       \
                            data-name="' + item.name + '"                             \
                            data-role="' + item.role + '"                             \
                            data-location="' + item.location + '"                     \
                            data-id="' + item.id + '"                                 \
                            data-private="' + item.private + '"                       \
                            data-size="' + item.size + '"                             \
                            data-laborators="' + item.laborators + '"                 \
                            data-type="' + item.type + '">                            \
                            <div class="corner ' + item.corner + '"></div>            \
                            <div class="icon ' + item.icon + '"></div>                \
                            <div class="name">' + item.name + '</div>                 \
                        </div>                                                        \
                    ');
                });

                $(".pane").html($(files).toggle(!hide));
                $(".sidebar .info").text(json.length + " file" + ((json.length != 1) ? "s" : ""));
                if(history) window.history.pushState(null, null, "/documents/");
                window.socketUtil.pageTrack();
                window.documents.locationActivated = "online";
            }
        });
    },
    locationDirectory: function(location, path, history, type, override) {
        var response = window.documents.cachedLocations(location);
        var files = "";

        path = $.trim(path)
        path = (path.slice(-1) == "/") ? path : path + "/";

        if(!path || path == "/") {
            path = "";
        }

        if(response[path] != undefined && !override) {
            finish(response[path]);
        } else {
            window.documents.headerBar(["message"], "downloading directory listing...", true);
            $.get("/documents/location/" + location + "/" + path,
                function(json) {
                    if(json.success == false) {
                        if(json.error_message == "Bad Github Oauth Token") {
                            window.documents.headerBar(["message"],
                                "Opps! Github Needs To Be <a href='" + window.config.apps.github.link + "'>Reauthorized</a>", true);
                        } else {
                            if(history) {
                                window.documents.headerBar(["message"], json.error_message);
                            } else {
                                window.documents.location("online", null, true);
                            }
                        }
                    } else {
                        window.documents.addcachedLocation(location, path, json.contents);
                        finish(json.contents);
                    }
                }
            );
        }

        function finish(response) {
            $.each(response, function(i, item) {
                window.documents.fileParser(item, false);

                files += ('                                                 \
                    <div class="item ' + item.class + ' ' + item.color + '" \
                        data-name="' + item.name + '"                       \
                        data-path="' + item.path + '"                       \
                        data-type="' + item.type + '"                       \
                        data-size="' + item.size + '"                       \
                        data-location="' + location + '">                   \
                        <div class="icon ' + item.icon + '"></div>          \
                        <div class="name">' + item.name + '</div>           \
                        <div class="progress">                              \
                            <div class="bar"></div>                         \
                        </div>                                              \
                    </div>                                                  \
                ');
            });

            $(".pane").html(files);
            $(".sidebar .info").text(response.length + " file" + ((response.length != 1) ? "s" : ""));
            path = (path.substr(-1) != '/' && path) ? path + "/" : path;
            if(history) window.history.pushState(null, null, "/documents/" + location + "/" + path);
            window.socketUtil.pageTrack();
            window.documents.locationActivated = location;
            var header = ["filters-non-online", "add", "download"];

            if(type == "sftp") {
                header.push("terminal");
            }

            window.documents.headerBar(header);
        }
    },
    fileSelect: function(show) {
        if(show) {
            $(".pane .item").filter(function() {
                if(["file-template", "file-script"].indexOf($(this).data("type")) == -1) {
                    if($(this).hasClass("disabled")) {
                        $(this).attr("data-disabled", "disabled");
                    } else {
                        $(this).addClass("disabled");
                    }

                    return false;
                } else {
                    return true;
                }
            }).each(function() {
                var oldClass = $(this).find(".icon").data("default");
                var newClass = $(this).find(".icon").attr("class");

                $(this)
                    .attr("data-selected", "false")
                    .find(".icon")
                    .attr({
                        "data-default": ((!oldClass) ? newClass : oldClass),
                        "class": "icon " + config.icons.dashed_add
                    });
            });

            window.documents.mode = ["selectFiles"];
        } else {
            $(".pane .item").filter(function() {
                if(["file-template", "file-script"].indexOf($(this).data("type")) == -1) {
                    if($(this).data("disabled") != "disabled") {
                        $(this).removeClass("disabled");
                    }

                    return false;
                } else {
                    return true;
                }
            }).each(function() {
                $(this).attr("data-selected", "")
                $(this).find(".icon")
                    .attr({
                        "data-default": "",
                        "class": $(this).find(".icon").data("default")
                    });
            });

            window.documents.mode = [];
        }
    },
    fileSelectClick: function(element) {
        if(window.documents.mode[0] == "selectFiles") {
            if(element.attr("data-selected") == "true") {
                element
                    .attr("data-selected", "false")
                    .find(".icon")
                        .attr("class", "icon " + config.icons.dashed_add);
            } else {
                element
                    .attr("data-selected", "true")
                    .find(".icon")
                        .attr("class", "icon " + config.icons.dashed_check);
            }
        }
    },
    fileProgress: function(element, percent, abort, callback) {
        if(percent >= 0 && percent <= 100 && !abort) {
            if(!element.find(".progress").is(":visible")) {
                window.documents.fileProgressOpen(element, function() {
                    element.find(".bar").animate({
                        width: percent + "%"
                    }, 200);

                    if(percent == 100) {
                        setTimeout(function() {
                            window.documents.fileProgressClose(element, callback)
                        }, 300);
                    } else {
                        if(callback) callback();
                    }
                });
            } else {
                element.find(".bar").animate({
                    width: percent + "%"
                }, 200);

                if(percent == 100) {
                    setTimeout(function() {
                        window.documents.fileProgressClose(element, callback)
                    }, 300);
                } else {
                    if(callback) callback();
                }
            }
        } else if(element.find(".progress").is(":visible")) {
            window.documents.fileProgressClose(element, callback);
        }
    },
    fileProgressOpen: function(element, callback) {
        element.find(".bar").width("0%");
        element.find(".name").fadeOut(200);
        setTimeout(function() {
            element
                .find(".progress")
                .show()
                .animate({
                    bottom: "8px",
                    opacity: 1
                }, 200);

            if(callback) setTimeout(callback, 300);
        });
    },
    fileProgressClose: function(element, callback) {
        element.find(".progress").animate({
            bottom: "0px",
            opacity: 0
        }, 200);

        setTimeout(function() {
            element
                .find(".progress")
                .hide()
                .parent(".item")
                .find(".name")
                .fadeIn(200);

            if(callback) setTimeout(callback, 300);
        }, 300);
    },
    fileSearch: function(search, filters) {
        $(".pane .item").each(function() {
            var item = $(this);
            var show = true;

            $.when(Function)
            .then(function() {
                if(search) {
                    if(item.attr("data-name").toLowerCase().indexOf(search.toLowerCase()) == -1) {
                        show = false;
                    }
                }
            })
            .then(function() {
                filters.each(function() {
                    var value = $(this).find(":selected").attr("value");
                    if(value && item.attr("data-" + $(this).attr("name")) != value) {
                        show = false;
                    }
                });
            }).done(function() {
                item.toggle(show);
            });
        });

        $(".sidebar .info").text($(".pane .item:visible").length + " files");
    },
    fileDownload: function(files, open) {
        if(open) {
            $(".pane .item")
                .not(files)
                .addClass("disabled");

            files
                .find(".icon")
                .attr("class", "icon spin " + config.icons.spinner);
        }

        window.documents.fileProgress(files, 0, false, function() {
            files.each(function(count) {
                var file = $(this);
                $.get("/documents/location/" + file.data("location") + "/" + file.data("path"), function(json) {
                    if(json.success == false) {
                        window.documents.headerBar(["message"], json.error_message);
                    } else {
                        window.documents.fileProgress(file, 100, false, function() {
                            if(open && (count+1) == files.length) {
                                window.location.href = "/editor/" + json.document + "/";
                            }
                        });
                    }
                });
            });
        });
    },
    fileCreated: function(responses) {
        if(!window.url_params(true)["location"]) {
            $.each(responses.documents, function(i, item) {
                window.documents.fileParser(item, true);

                files = $('                                                       \
                    <div class="item ' + item.class + " " + item.color + '"       \
                        data-name="' + item.name + '"                             \
                        data-role="' + item.role + '"                             \
                        data-location="' + item.location + '"                     \
                        data-id="' + item.id + '"                                 \
                        data-private="' + item.private + '"                       \
                        data-size="' + item.size + '"                             \
                        data-laborators="' + item.laborators + '"                 \
                        data-type="' + item.type + '">                            \
                        <div class="corner ' + item.corner + '"></div>            \
                        <div class="icon ' + item.icon + '"></div>                \
                        <div class="name">' + item.name + '</div>                 \
                    </div>                                                        \
                ')
                .appendTo(".pane")
                .animate({ opacity: 1 }, 200);
            });
        } else {
            window.documents.headerBar(
                ["message"],
                "Your New File" + ((responses.documents.length != 1) ? "s Are" : " Is") + " Located In Your Drive"
            );
        }
    },
    fileRename: function(data) {
        window.documents.fileParser(data.document, true);

        $(".pane .file[data-id='" + data.document.id + "']")
            .attr({
                "class": "item file " + data.document.color,
                "data-name": data.document.name,
                "data-type": data.document.type
            })
            .find(".icon")
            .attr("class", "icon " + data.document.icon)
            .siblings(".name")
            .text(data.document.name);
    },
    fileParser: function(item, online) {
        if(online) {
            //File Users
            if(item.users <= 2) {
                item["laborators"] = 0;
            } else if(item.users >= 3 && item.users <= 5) {
                item["laborators"] = 1;
            } else if(item.users >= 6 && item.users <= 8) {
                item["laborators"] = 2;
            } else if(item.users >= 9 && item.users <= 11) {
                item["laborators"] = 3;
            } else {
                item["laborators"] = 4;
            }

            //File Size
            if(item.size <= 1024) {
                item["size"] = 0;
            } else if(item.size > 1024 && item.size <= 1024 * 10) {
                item["size"] = 1;
            } else if(item.size > 1024 * 10 && item.size <= 1024 * 100) {
                item["size"] = 2;
            } else if(item.size > 1024 * 100 && item.size <= 1024 * 1024) {
                item["size"] = 3;
            } else {
                item["size"] = 4;
            }

            // File Type
            switch(item.type) {
                case "file-template":
                    item["class"] = "file";
                    item["color"] = "blue";
                    item["icon"] = config.icons.file_template;
                    break;
                case "file-script":
                    item["class"] = "file";
                    item["color"] = "blue";
                    item["icon"] =  config.icons.file_script;
                    break;

                case "file-zip":
                    item["class"] = "file disabled";
                    item["color"] = "red";
                    item["icon"] = config.icons.file_zip;
                    break;
                case "file-image":
                    item["class"] = "file";
                    item["color"] = "green";
                    item["icon"] = config.icons.file_image;
                    break;
                case "file-notebook":
                    item["class"] = "file";
                    item["color"] = "orange";
                    item["icon"] = config.icons.file_notebook;
                    break;
                case "file-math":
                    item["class"] = "file";
                    item["color"] = "purple";
                    item["icon"] = config.icons.file_math;
                    break;

                default:
                    item["class"] = "file";
                    item["color"] = "";
                    item["icon"] = config.icons.file;
                    break;
            }

            // Protection
            if(item.private) {
                item["corner"] = config.icons.locked;
            } else {
                item["corner"] = "";
            }
        }  else {
            //File Size
            if(!item.size) {
                item["size"] = "";
            } else if(item.size <= 1024) {
                item["size"] = 0;
            } else if(item.size > 1024 && item.size <= 1024 * 10) {
                item["size"] = 1;
            } else if(item.size > 1024 * 10 && item.size <= 1024 * 100) {
                item["size"] = 2;
            } else if(item.size > 1024 * 100 && item.size <= 1024 * 1024) {
                item["size"] = 3;
            } else {
                item["size"] = 4;
            }

            //File Types
            switch(item.type) {
                case "back":
                    item["color"] = "";
                    item["class"] = "back";
                    item["icon"] = config.icons.file_back;
                    break;
                case "folder":
                    item["color"] = "purple";
                    item["class"] = "folder";
                    item["icon"] = config.icons.folder;
                    break;
                case "folder-symlink":
                    item["color"] = "orange";
                    item["class"] = "folder";
                    item["icon"] = config.icons.folder;
                    break;
                case "file-template":
                    item["color"] = "blue";
                    item["class"] = "file";
                    item["icon"] = config.icons.file_template;
                    break;
                case "file-script":
                    item["color"] = "blue";
                    item["class"] = "file";
                    item["icon"] = config.icons.file_script;
                    break;
                case "file-zip":
                    item["color"] = "red";
                    item["class"] = "file disabled";
                    item["icon"] = config.icons.file_zip;
                    break;
                case "file-image":
                    item["color"] = "green";
                    item["class"] = "file";
                    item["icon"] = config.icons.file_image;
                    break;
                default:
                    item["color"] = "";
                    item["class"] = "file disabled";
                    item["icon"] = config.icons.file;
                    break;
            }
        }

        return item;
    },
    terminal: function(close) {
        if(window.documents.terminalActive == window.documents.locationActivated || close) {
            $(".terminal iframe").fadeOut(150);

            setTimeout(function() {
                $(".terminal iframe").attr("src", "");
                $(".pane").removeClass("extend");
                $(".terminal").removeClass("active");
                $(".terminal a").attr("href", "");
            }, 200);
            window.documents.terminalActive = null;
        } else {
            var terminal =  "/terminals/" + window.documents.locationActivated + "/";
            $(".pane").addClass("extend");
            $(".terminal").addClass("active");
            $('.terminal iframe')
                .hide()
                .attr("src", terminal + "embed/")
                .load(function() {
                    $(this).show();
                });
            $(".terminal a").attr("href", terminal);
            window.documents.terminalActive = window.documents.locationActivated;
        }
    }
}
