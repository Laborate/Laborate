window.newsUtil = {
    page: 0,
    loading: false,
    tags: [],
    group: null,
    feed: function(page, override) {
        var _this = this;

        if(!_this.loading) {
            _this.loading = true;
            $(".main .loader").addClass("activated");
            $(".main .loader").removeClass("finished");

            if(override) {
                $(".main .posts").html("");
            }

            $.get("/news/pages/" + page + "/", {
                group: _this.group,
                tags: _this.tags
            }, function(data) {
                if(typeof data == "string") {
                    data = $(data).map(function() {
                        if(override || $("#post_" + $(this).attr("data-id")).length == 0) {
                            return this;
                        }
                    });

                    if(override) {
                        $(".main .posts").html(data);
                        _this.page = 1;
                    } else {
                        $(".main .posts").append(data);
                        _this.page += 1;
                    }
                } else {
                    $(".main .loader").addClass("finished");

                    if(override) {
                        $(".main .posts").html(data);
                        _this.page = 1;
                    }
                }

                _this.loading = false;
                $(".main .loader").removeClass("activated");
            });
        }
    },
    new_post: function(data) {
        var _this = window.newsUtil;
        if(_this.group == data.group) {
            var post = $(data.content);
            post.find(".comment .gravatar img").attr("src", config.gravatar);
            post.hide().css("opacity", 0);

            $(".main .posts").prepend(post);
            post.slideDown(200);

            setTimeout(function() {
                post.animate({ "opacity": 1}, 200)
            }, 250);
        }
    },
    new_reply: function(data) {
        var _this = window.newsUtil;
        var post = $(data.content);
        var comment = $("#post_" + data.parent + " .bottom .comment");
        var count = parseInt(comment.attr("data-count")) + 1;
        var counter = "Comment";

        if(count > 0) {
            counter += " <strong>(" + count + ")</strong>";
        }

        comment
            .attr("data-count", count)
            .html(counter);

        post.hide().css("opacity", 0);

        $("#post_" + data.parent + " .replies")
            .append(post)
            .removeClass("hidden");

        post.slideDown(200);

        setTimeout(function() {
            post.animate({ "opacity": 1}, 200)
        }, 250);
    },
    new_like: function(data) {
        var _this = window.newsUtil;
        var like = $("#like_" + data.post);
        var liked = (data.from == config.user) ? data.like : (like.attr("data-like") == "true");
        var counter = liked ? "Unlike" : "Like";

        if(data.count > 0) {
            counter += " <strong>(" + data.count + ")</strong>";
        }

        like
            .html(counter)
            .attr("data-like", liked);
    },
    preview: function(preview, form) {
        $(".main .container > .form .preview").toggleClass("activated", preview);

        if(preview) {
            $.post("/news/preview", {
                content: form.find("textarea").val()
            }, function(data) {
                if(typeof data == "string") {
                    $(".main .container > .form .previewer").html(data).show();
                    $(".main .container > .form textarea").hide();
                } else {
                    window.error.open(data.error_message);
                }
            });
        } else {
            $(".main .container > .form .previewer").hide().html("");
            $(".main .container > .form textarea").show();
        }
    },
    post: function(form) {
        if(config.logged_in) {
            var _this = this;
            var content = form.find("textarea").val();

            if(content) {
                form.find(".post").attr("disabled", "disabled");

                $.post("/news/create/", {
                    content: content,
                    group: _this.group
                }, function(data) {
                    if(typeof data == "string") {
                        var post = $(data);
                        post.hide().css("opacity", 0);

                        $(".main .posts").prepend(post);
                        post.slideDown(200);

                        setTimeout(function() {
                            post.animate({ "opacity": 1}, 200)
                        }, 250);

                        form.find(".previewer").hide().html("");
                        form.find("textarea").show().val("").trigger('autosize.resize');
                        form.find(".post").attr("disabled", false);

                        window.socketUtil.socket.emit("newsPost", {
                            content: data,
                            group: _this.group
                        });
                    } else {
                        window.error.open(data.error_message);
                    }
                });
            }
        } else {
            window.error.open("Please Login or Register");
        }
    },
    reply: function(form) {
        if(config.logged_in) {
            var content = form.find(".input").val();
            var parent = form.find(".hidden").val();

            if(content) {
                $.post("/news/" + parent + "/reply/", {
                    content: content
                }, function(data) {
                    if(typeof data == "string") {
                        var post = $(data);
                        var comment = $("#post_" + parent + " .bottom .comment");
                        var count = parseInt(comment.attr("data-count")) + 1;
                        var counter = "Comments";

                        if(count > 0) {
                            counter += " <strong>(" + count + ")</strong>";
                        }

                        comment
                            .attr("data-count", count)
                            .html(counter);

                        post.hide().css("opacity", 0);

                        $("#post_" + parent + " .replies")
                            .append(post)
                            .removeClass("hidden");

                        post.slideDown(200);

                        setTimeout(function() {
                            post.animate({ "opacity": 1}, 200)
                        }, 250);

                        form.find(".input").val("");

                        window.socketUtil.socket.emit("newsReply", {
                            parent: parent,
                            content: data
                        });
                    } else {
                        window.error.open(data.error_message);
                    }
                });
            }
        } else {
            window.error.open("Please Login or Register");
        }
    },
    like: function(element, reply) {
        if(config.logged_in) {
            var post = element.parents((reply) ? ".reply" : ".post").attr("data-id");

            $.post("/news/" + post + "/like/", function(data) {
                if(data.success) {
                    var counter = (data.like) ? "Unlike" : "Like";

                    if(data.count > 0) {
                        counter += " <strong>(" + data.count + ")</strong>";
                    }

                    element
                        .html(counter)
                        .attr("data-like", data.like);

                    window.socketUtil.socket.emit("newsLike", {
                        like: data.like,
                        count: data.count,
                        post: post
                    });
                } else {
                    window.error.open(data.error_message);
                }
            });
        } else {
            window.error.open("Please Login or Register");
        }
    },
    mention: function(element) {
        var post = element.parents(".post");
        var reply = element.parents(".reply");
        var input = post.find(".comment .input");

        if(input.val()) {
            input.val(input.val() + " @" + reply.attr("data-from"));
        } else {
            input.val("@" + reply.attr("data-from"));
        }
    },
    share: function(element) {
        var _this = this;
        var post = element.parents(".post").attr("data-id");

        $.get("/news/" + post + "/share/", function(data) {
            if(typeof data == "string") {
                var popup = $(data);
                var container = $(".main .container");
                var offset = element.offset();
                var offset_container = container.offset();

                container.append(popup);
                popup
                    .fadeIn(300)
                    .css({
                        top: (offset.top - offset_container.top - popup.outerHeight(true) - 10),
                        left: (offset.left - offset_container.left + (element.width()/2) - (popup.outerWidth(true)/2))
                    });
            } else {
                window.error.open(data.error_message);
            }
        });
    },
    share_close: function() {
        var element = $(".share_popup");
        element.fadeOut(300);

        setTimeout(function() {
            element.remove();
        }, 350);
    },
    social: function(element) {
        var url,
            post = element.parents(".share_popup").attr("data-url");

        switch(element.attr("data-id")) {
            case "facebook":
                url = "https://www.facebook.com/sharer/sharer.php?";
                url += "u=" + post;
                break;

            case "twitter":
                url = "https://twitter.com/intent/tweet?";
                url += "text=Check out this post on @" + config.social.twitter;
                url += "&related=" + config.social.twitter;
                url += "&url=" + post;
                break;

            case "google_plus":
                url = "https://plus.google.com/share?";
                url += "url=" + post;
                break;
        }

        window.open(url, "sharer", [
            "width=500", "height=400", "directories=no", "titlebar=no",
            "toolbar=no", "location=no", "status=no", "menubar=no",
            "scrollbars=no", "resizable=no"
        ].join(","));
    },
    groups: function(element) {
        var activated = element.hasClass("activated");
        $(".groups .option").removeClass("activated");

        if(activated) {
            this.group = null;
            element.removeClass("activated");
        } else {
            this.group = element.attr("data-id");
            element.addClass("activated");
        }

        this.feed(1, true);
    },
    tag: function(form) {
        var _this = this;
        var tag = form.find(".input").val();

        if(_this.tags.indexOf(tag) == -1) {
            $.post("/news/tags/create/", {
                tag: tag
            }, function(data) {
                _this.tags.push(tag);
                _this.feed(1, true);

                $(".filters > .tags .tags").append(data);
                form.find(".input").val("");
            });
        } else {
            form.find(".input").val("");
        }
    },
    tag_remove: function(element) {
        this.tags.remove(this.tags.indexOf(element.attr("data-name")));
        this.feed(1, true);
        element.remove();
    },
    scroll: function() {
        if(!$(".main .loader").hasClass("finished")) {
            var bottom = ($(window).scrollTop() + $(window).height() > $(document).height() - 5);
            $(".main .loader").toggleClass("activated", bottom);

            if(bottom) {
                window.newsUtil.feed(window.newsUtil.page + 1);
            }
        }
    }
}
