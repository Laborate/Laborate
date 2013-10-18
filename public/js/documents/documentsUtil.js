/////////////////////////////////////////////////
//          Document Instances
/////////////////////////////////////////////////
window.documents = {
    mode: new Array(),
    locationActivated: null,
    locationIcons: new Array(),
    headerBarPrevious: null,
    timer: null,
    uploadFiles: [],
    popup: function(action, data, header) {
        var container = $(".popup .container");
        var new_css = {};
        var show = true;

        container
            .attr("style", "")
            .find(".action")
            .hide()
            .find("input")
            .not("[type='file']")
            .val("")
            .removeClass("error");

        container
            .find(".header .download")
            .hide();

        container
            .find("#popup-" + action)
            .show();

        switch(action) {
            case "create":
                new_css.width = "250px";
                new_css.height = "142px";
                break;

            case "upload":
                new_css.width = "300px";
                new_css.height = "305px";

                container
                    .find("#popup-" + action)
                    .find(".upload-listing")
                    .html(function() {
                        return $.map(data, function(item) {
                            return $('                                              \
                                <div class="upload-file">                           \
                                    <div class="icon icon-file"></div>              \
                                    <div class="name">' + item.name + '</div>       \
                                </div>                                              \
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
                    form.find("input").val("");
                    window.documents.popup("close");
                    window.documents[form.data("callback")](result);
                    submit.text(submit.attr("data-original"));
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
                        if((item.type == "" || item.type.match(/(?:text|json)/)) && item.size < 1024 * 100) {
                            return item;
                        }
                    });

                    if(files.length != 0) window.documents.popup("upload", files, "Upload Files");
                }
            });
    },
    headerBar: function(action, message, permanent) {
        $(".bottom > div").hide();
        $(".bottom .filter").hide();
        $(".bottom .filter select").val("add filter");
        $(".top input").val("");
        window.documents.mode = [];

        $.each(action, function(i, item) {
            switch(item) {
                case "message":
                    $(".bottom .message").html(message).show();

                    if(window.documents.headerBarPrevious && !permanent) {
                        setTimeout(function() {
                           window.documents.headerBar(window.documents.headerBarPrevious);
                        }, 5000);
                    }

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
                case "side-button":
                    $(".side-button").show();
                    break
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
        if(location != window.url_params()["location"] || path != window.url_params()["dir"]) {
            $(".files").html("");
        }

        if(window.documents.interval) clearTimeout(window.documents.timer);

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
    locationReload: function() {
        if(window.documents.locationActivated && window.documents.mode.length == 0) {
            window.documents.location(window.url_params()["location"], window.url_params()["dir"], false);
        }
    },
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
                window.documents.locationIcons[location], false, false);
            element.parents(".item").attr("data-counter", 0);
        }
    },
    locationNotificationChange: function(element, className, active, big) {
        if(element.attr("class").indexOf(className) == -1) {
            element.fadeOut(200);
            setTimeout(function() {
                element
                    .attr("class", className)
                    .toggleClass("notify", active)
                    .toggleClass("big", active)
                    .fadeIn(200);
            }, 300);
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
    onlineDirectory: function(history) {
        window.documents.headerBar(["filters-online", "add"]);

        window.documents.timer = setTimeout(function() {
            window.documents.headerBar(["message"], "downloading directory listing...");
        }, 5000);

        $.get("/documents/files/", function(json) {
            if(json.success == false) {
                window.documents.headerBar(["message"], json.error_message);
            } else {
                clearTimeout(window.documents.timer);
                window.documents.headerBar(["filters-online", "add"]);

                var files = "";
                $.each(json, function(i, item) {
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
                            item["color"] = "blue";
                            item["icon"] = "icon-file-xml";
                            break;
                        case "file-script":
                            item["color"] = "blue";
                            item["icon"] = "icon-file-css";
                            break;

                        /* When More Products Are Added
                        case "file-zip":
                            item["color"] = "red";
                            item["icon"] = "icon-file-zip disabled";
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
                        */

                        default:
                            item["color"] = "blue";
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
                            data-size="' + item.size + '"                   \
                            data-laborators="' + item.laborators + '"       \
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
                                window.documents.location("online", null, true);
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
                        item["class"] = "file disabled";
                        item["icon"] = "icon-file-zip";
                        break;
                    case "file-image":
                        item["color"] = "green";
                        item["class"] = "file";
                        item["icon"] = "icon-image";
                        break;
                    default:
                        item["color"] = "";
                        item["class"] = "file disabled";
                        item["icon"] = "icon-file";
                        break;
                }

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

            $(".files").html(files);
            path = (path.substr(-1) != '/' && path) ? path + "/" : path;
            if(history) window.history.pushState(null, null, "/documents/" + location + "/" + path);
            window.documents.locationActivated = location;
            window.documents.headerBar(["filters-non-online", "download"]);
        }
    },
    fileSelect: function(show) {
        if(show) {
            $(".files .item").filter(function() {
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
                        "class": "icon icon-add"
                    });
            });

            window.documents.mode = ["selectFiles"];
        } else {
            $(".files .item").filter(function() {
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
                        .attr("class", "icon icon-add");
            } else {
                element
                    .attr("data-selected", "true")
                    .find(".icon")
                        .attr("class", "icon icon-checked-2");
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
        $(".files .item").each(function() {
            var item = $(this);
            var show = true;

            if(search && item.data("name").toLowerCase().indexOf(search.toLowerCase()) == -1) {
                show = false;
            }

            window.debug = filters;

            filters.each(function() {
                var value = $(this).find(":selected").attr("value");
                if(value && item.data($(this).attr("name")) != value) {
                    show = false;
                }
            });

            $(this).toggle(show);
        });
    },
    fileDownload: function(files, open) {
        window.documents.locationNotification("online", "upload");
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

                        if((count+1) == files.length) {
                            window.documents.locationNotification("online", "counter", files.length);
                        }
                    }
                });
            });
        });
    },
    fileCreated: function(responses) {
        $.each(responses.documents, function(i, item) {
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
                    item["color"] = "blue";
                    item["icon"] = "icon-file-xml";
                    break;
                case "file-script":
                    item["color"] = "blue";
                    item["icon"] = "icon-file-css";
                    break;

                /* When More Products Are Added
                case "file-zip":
                    item["color"] = "red";
                    item["icon"] = "icon-file-zip disabled";
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
                */

                default:
                    item["color"] = "blue";
                    item["icon"] = "icon-file";
                    break;
            }

            file = $('                                          \
                <div class="item file ' + item.color + '"       \
                    style="opacity:0;"                          \
                    data-name="' + item.name + '"               \
                    data-id="' + item.id + '"                   \
                    data-size="' + item.size + '"               \
                    data-laborators="0"                         \
                    data-type="' + item.type + '">              \
                    <div class="icon ' + item.icon + '"></div>  \
                    <div class="name">' + item.name + '</div>   \
                    <div class="progress">                      \
                        <div class="bar"></div>                 \
                    </div>                                      \
                </div>                                          \
            ')
            .appendTo(".files")
            .animate({ opacity: 1 }, 1000);
        });
    }
}
