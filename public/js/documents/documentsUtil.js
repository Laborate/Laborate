/////////////////////////////////////////////////
//          Document Instances
/////////////////////////////////////////////////
window.documents = {
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

                locations += ('                                                  \
                    <div class="item" data-key="' + item.key + '">              \
                        <div class="container">                                 \
                            <div class="name">' + item.name + '</div>           \
                            <div class="icon ' + item.class + '"></div> \
                        </div>                                                  \
                        <div class="active"></div>                              \
                    </div>                                                      \
                ');
            });

            $(".locations .item").not("[data-key='online']").remove();
            $(".locations").append(locations);
            window.debug = json;
        });
    },
    location: function(location, path, history) {
        $(".locations .item").removeClass("activated");
        $(".locations .item[data-key='" + location + "']").addClass("activated");

        if(location == "online" || !location) {
            $(".locations .item[data-key='online']").addClass("activated");
            window.documents.onlineDirectory(history);
        } else {
            window.documents.locationDirectory(location, path, history);
        }
    },
    locationIcons: new Array(),
    locationNotification: function(location, action) {
        var element = $(".locations .item[data-key='" + location + "']").find(".icon");

        if(!(location in window.documents.locationIcons)) {
            window.documents.locationIcons[location] = element.attr("class");
        }

        if(action) {
            var actions = {
                "upload": "icon-arrow-up-2",
                "download": "icon-arrow-down-2",
                "count": function(className) {
                    var count = /icon-number.*?(\d)/g.exec(className);
                    count = ((count != null) ? parseInt(count[1]) : (className.indexOf("icon-number") != -1) ? 1 : 0) + 1;
                    if(count <= 9 && className.indexOf("icon-notice") == -1) {
                        return "icon-number" + ((count != 1) ? "-" + count : "");
                    } else {
                        return "icon-notice";
                    }
                }(element.attr("class"))
            };

            if(action in actions) {
                window.documents.locationNotificationChange(element,
                    element.attr("class").replace(/icon-.*/g, actions[action]), true);
            }
        } else {
            window.documents.locationNotificationChange(element,
                window.documents.locationIcons[location], false);
        }
    },
    locationNotificationChange: function(element, className, active) {
        element.fadeOut(200);
        setTimeout(function() {
            element
                .attr("class", className)
                .toggleClass("notify", active)
                .fadeIn(200);
        }, 300);
    }
}
