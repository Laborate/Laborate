/////////////////////////////////////////////////
//          Document Instances
/////////////////////////////////////////////////
window.documents = {
    mode: [],
    headerBar: function(action, message) {
        $(".bottom > div").hide();
        $(".bottom .filter").hide();
        window.documents.mode = [];

        $.each(action, function(i, item) {
            switch(item) {
                case "message":
                    $(".bottom .message").html(message).show();
                    break;
                case "filters-online":
                    $(".bottom .filters, .bottom .filter[data-type='online']").show();
                    break;
                case "filters-non-online":
                    $(".bottom .filters, .bottom .filter[data-type='non-online']").show();
                    break;
                case "add":
                    $(".bottom .add-files").show();
                    break;
                case "download":
                    $(".bottom .download-files").show();
                    break;
            }
        });
    },
    locations: function() {
        $.get("/documents/locations/", function(json) {
            var locations = "";
            $.each(json, function(i, item) {
                switch(item.type) {
                    case "sftp":
                        item["class"] = "icon-install";
                        break;
                    case "github":
                        item["class"] = "icon-github-3";
                        break;
                    case "bitbucket":
                        item["class"] = "icon-bitbucket";
                        break;
                    case "dropbox":
                        item["class"] = "icon-dropbox-2";
                        break;
                    case "google":
                        item["class"] = "icon-google-drive";
                        break;
                    default:
                        item["class"] = "";
                        break;
                }

                locations += ('                                                 \
                    <div class="item"                                           \
                        data-key="' + item.key + '"                             \
                        data-counter="0">                                       \
                        <div class="container">                                 \
                            <div class="name">' + item.name + '</div>           \
                            <div class="icon ' + item.class + '"></div>         \
                        </div>                                                  \
                        <div class="active"></div>                              \
                    </div>                                                      \
                ');
            });

            $(".locations .item").not("[data-key='online']").remove();
            $(".locations").append(locations);

            var interval = setInterval(function() {
                if(window.documents.locationActivated) {
                    $(".locations .item[data-key='" + window.documents.locationActivated + "']").addClass("activated");
                    clearInterval(interval);
                }
            }, 100);
        });
    },
    location: function(location, path, history) {
        $(".locations .item").removeClass("activated");
        $(".locations .item[data-key='" + location + "']").addClass("activated");
        $(".files").html("");

        if(location == "online" || !location) {
            window.documents.onlineDirectory(history);
            $(".locations .item[data-key='online']").addClass("activated");

            var className = $(".locations .item[data-key='" + location + "']").find(".icon").attr("class");
            if(className.indexOf("icon-number") != -1 || className.indexOf("icon-notice") != -1) {
                window.documents.locationNotification("online", false);
            }
        } else {
            window.documents.locationDirectory(location, path, history);
        }
    },
    locationActivated: null,
    locationReload: function() {
        if(window.documents.locationActivated) {
            window.documents.location(window.url_params()["location"], window.url_params()["dir"], false);
        }
    },
    locationIcons: new Array(),
    locationNotification: function(location, action, count) {
        var element = $(".locations .item[data-key='" + location + "']").find(".icon");

        if(!(location in window.documents.locationIcons)) {
            window.documents.locationIcons[location] = element.attr("class");
        }

        if(action) {
            var actions = {
                "upload": "icon-arrow-up-2",
                "download": "icon-arrow-down-2",
                "counter": function() {
                    if(count) {
                        var parentContainer = element.parents(".item");
                        count += parseInt(parentContainer.attr("data-counter"));
                        parentContainer.attr("data-counter", count);
                        if(count <= 9 && element.attr("class").indexOf("icon-notice") == -1) {
                            return "icon-number" + ((count != 1) ? "-" + count : "");
                        } else {
                            return "icon-notice";
                        }
                    }
                }()
            };

            if(action in actions) {
                window.documents.locationNotificationChange(element,
                    element.attr("class").replace(/icon-.*/g, actions[action]), true);
            }
        } else {
            window.documents.locationNotificationChange(element,
                window.documents.locationIcons[location], false);
            element.parents(".item").attr("data-counter", 0);
        }
    },
    locationNotificationChange: function(element, className, active, big) {
        element.fadeOut(200);
        setTimeout(function() {
            element
                .attr("class", className)
                .toggleClass("notify", active)
                .toggleClass("big", active)
                .fadeIn(200);
        }, 300);
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
    onlineDirectory: function(history) {
        window.documents.headerBar(["filters-online", "add"]);
        $.get("/documents/files/", function(json) {
            if(json.success == false) {
                window.documents.headerBar(["message"], json.error_message);
            } else {
                var files = "";
                $.each(json, function(i, item) {
                    // File Type
                    switch(item.type) {
                        case "file-template":
                            item["color"] = "blue";
                            item["icon"] = "icon-file-xml";
                            break;
                        case "file-script":
                            item["color"] = "green";
                            item["icon"] = "icon-file-css";
                            break;

                        /* When More Products Are Added */
                        case "file-zip":
                            item["color"] = "red";
                            item["icon"] = "icon-file-zip";
                            break;
                        case "file-image":
                            item["color"] = "green";
                            item["icon"] = "icon-image";
                            break;
                        case "file-notebook":
                            item["color"] = "green";
                            item["icon"] = "icon-notebook";
                            break;
                        case "file-math":
                            item["color"] = "purple";
                            item["icon"] = "icon-calculator";
                            break;
                        default:
                            item["color"] = "";
                            item["icon"] = "icon-file";
                            break;
                    }

                    // Protection
                    switch(item.protection) {
                        case "password":
                            item["corner"] = "icon-lock";
                            break;
                        case "assigned":
                            item["corner"] = "icon-users";
                            break;
                        default:
                            item["corner"] = "";
                            break;
                    }

                    files += ('                                             \
                        <div class="item file ' + item.color + '"           \
                            data-name="' + item.name + '"                   \
                            data-location="' + item.location + '"           \
                            data-id="' + item.id + '"                       \
                            data-protection="' + item.protection + '"       \
                            data-type="' + item.type + '">                  \
                            <div class="corner ' + item.corner + '"></div>  \
                            <div class="icon ' + item.icon + '"></div>      \
                            <div class="name">' + item.name + '</div>       \
                        </div>                                              \
                    ');
                });

                $(".files").html(files);
                if(history) window.history.pushState(null, null, "/documents/");
                window.documents.locationActivated = "online";
            }
        });
    },
    locationDirectory: function(location, path, history) {
        var response = window.documents.cachedLocations(location);
        var files = "";

        path = $.trim(path)
        path = (path.slice(-1) == "/") ? path : path + "/";

        if(!path || path == "/") {
            path = "";
        }

        if(response[path] != undefined) {
            finish(response[path]);
        } else {
            window.documents.headerBar(["message"], "downloading directory listing...");
            $.get("/documents/location/" + location + "/" + path,
                function(json) {
                    if(json.success == false) {
                        if(json.error_message == "Bad Github Oauth Token") {
                            window.documents.headerBar(["message"], "Opps! Github Needs To Be <a href='" + json.github_oath + "'>Reauthorized</a>");
                        } else {
                            if(history) {
                                window.documents.headerBar(["message"], json.error_message);
                            } else {
                                window.documents.location("online");
                            }
                        }
                    } else {
                        window.documents.addcachedLocation(location, path, json);
                        finish(json);
                    }
                }
            );
        }

        function finish(response) {
            $.each(response, function(i, item) {
                switch(item.type) {
                    case "back":
                        item["color"] = "";
                        item["class"] = "back";
                        item["icon"] = "icon-reply";
                        break;
                    case "folder":
                        item["color"] = "purple";
                        item["class"] = "folder";
                        item["icon"] = "icon-folder";
                        break;
                    case "folder-symlink":
                        item["color"] = "orange";
                        item["class"] = "folder";
                        item["icon"] = "icon-folder";
                        break;
                    case "file-template":
                        item["color"] = "blue";
                        item["class"] = "file";
                        item["icon"] = "icon-file-xml";
                        break;
                    case "file-script":
                        item["color"] = "blue";
                        item["class"] = "file";
                        item["icon"] = "icon-file-css";
                        break;
                    case "file-zip":
                        item["color"] = "red";
                        item["class"] = "file";
                        item["icon"] = "icon-file-zip";
                        break;
                    case "file-image":
                        item["color"] = "green";
                        item["class"] = "file";
                        item["icon"] = "icon-image";
                        break;
                    default:
                        item["color"] = "";
                        item["class"] = "file";
                        item["icon"] = "icon-file";
                        break;
                }

                files += ('                                                 \
                    <div class="item ' + item.class + ' ' + item.color + '" \
                        data-name="' + item.name + '"                       \
                        data-path="' + item.path + '"                       \
                        data-type="' + item.type + '"                       \
                        data-location="' + location + '">                   \
                        <div class="icon ' + item.icon + '"></div>          \
                        <div class="name">' + item.name + '</div>           \
                        <div class="progress">                              \
                            <div class="bar"></div>                         \
                        </div>                                              \
                    </div>                                                  \
                ');
            });

            $(".files").html(files);
            path = (path.substr(-1) != '/' && path) ? path + "/" : path;
            if(history) window.history.pushState(null, null, "/documents/" + location + "/" + path);
            window.documents.locationActivated = location;
            window.documents.headerBar(["filters-non-online", "download"]);
        }
    },
    fileSelect: function(show) {
        if(show) {
            $(".files .file").each(function() {
                var oldClass = $(this).find(".icon").data("default");
                var newClass = $(this).find(".icon").attr("class");

                $(this)
                    .attr("data-selected", "false")
                    .find(".icon")
                    .attr({
                        "data-default": ((!oldClass) ? newClass : oldClass),
                        "class": "icon icon-add"
                    });
            });

            window.documents.mode = ["selectFiles"];
        } else {
            $(".files .file").each(function() {
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
                        .attr("class", "icon icon-add");
            } else {
                element
                    .attr("data-selected", "true")
                    .find(".icon")
                        .attr("class", "icon icon-checked-2");
            }
        }
    },
    fileProgress: function(element, percent) {
        if(percent >= 0 && percent <= 100) {
            if(!element.find(".progress").is(":visible")) {
                window.documents.fileProgressOpen(element, function() {
                    element.find(".bar").animate({
                        width: percent + "%"
                    }, 200);

                    if(percent == 100) {
                        setTimeout(function() {
                            window.documents.fileProgressClose(element)
                        }, 300);
                    }
                });
            } else {
                element.find(".bar").animate({
                    width: percent + "%"
                }, 200);

                if(percent == 100) {
                    setTimeout(function() {
                        window.documents.fileProgressClose(element)
                    }, 300);
                }
            }
        } else if(element.find(".progress").is(":visible")) {
            window.documents.fileProgressClose(element);
        }
    },
    fileProgressOpen: function(element, callback) {
        element.find(".bar").width("0%");
        element.find(".name").fadeOut(200);
        setTimeout(function() {
            element.find(".progress").show().animate({
                bottom: "8px",
                opacity: 1
            }, 200);
            if(callback) setTimeout(callback, 300);
            window.documents.locationNotification("online", "upload");
        });
    },
    fileProgressClose: function(element, callback) {
        element.find(".progress").animate({
            bottom: "0px",
            opacity: 0
        }, 200);

        setTimeout(function() {
            element.find(".progress").hide();
            element.find(".name").fadeIn(200);
            if(callback) setTimeout(callback, 300);
            window.documents.locationNotification("online", "counter", element.length);
        }, 300);
    },
    fileSearch: function(search, arguments) {
        $(".files .item").each(function(i, item) {
            $(this).toggle(($(this).data("name").toLowerCase().indexOf(search) != -1));
        });
    },
    fileDownload: function(files) {
        window.documents.fileProgress(files, 0);
        files.each(function() {
            var file = $(this);
            window.documents.fileProgress(file, 50);
            $.get("/documents/location/" + file.data("location") + "/" + file.data("path"), function(json) {
                if(json.success == false) {
                    window.documents.headerBar(["message"], json.error_message);
                } else {
                    window.documents.fileProgress(file, 100);
                }
            });
        });
    }
}
