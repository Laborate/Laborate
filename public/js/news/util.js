window.newsUtil = {
    page: 0,
    loading: false,
    tags: [],
    groups: null,
    feed: function(page, override) {
        var _this = this;

        if(!_this.loading) {
            _this.loading = true;

            $.get("/news/pages/" + page + "/", {
                groups: _this.groups,
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
                    $(".main .loader").fadeOut(200);

                    if(override) {
                        $(".main .posts").html(data);
                        _this.page = 1;
                    }
                }

                _this.loading = false;
            });
        }
    },
    new_post: function(data) {
        var post = $(data);
        post.find(".comment .gravatar img").attr("src", config.gravatar);
        post.hide().css("opacity", 0);

        $(".main .posts").prepend(post);
        post.slideDown(200);

        setTimeout(function() {
            post.animate({ "opacity": 1}, 200)
        }, 250);
    },
    new_reply: function(data) {
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
        var like = $("#post_" + data.post + " .bottom ." + ((data.reply) ? "reply-like" : "like"));
        var liked = (data.from == config.user) ? data.like : (like.attr("data-like") == "true");
        var count = parseInt(like.attr("data-count")) + ((data.like) ? 1 : -1);
        var counter = liked ? "Unlike" : "Like";

        if(count > 0) {
            counter += " <strong>(" + count + ")</strong>";
        }

        like
            .html(counter)
            .attr({
                "data-like": liked,
                "data-count": count
            });
    },
    preview: function(preview, form) {
        $(".main .container > .form .preview").toggleClass("activated", preview);

        if(preview) {
            $.ajax({
                type: "post",
                url: "/news/preview",
                data: {
                    content: form.find("textarea").val()
                },
                success: function(data) {
                    $(".main .container > .form .previewer").html(data).show();
                    $(".main .container > .form textarea").hide();
                }
            });
        } else {
            $(".main .container > .form .previewer").hide().html("");
            $(".main .container > .form textarea").show();
        }
    },
    post: function(form) {
        if(config.logged_in) {
            var content = form.find("textarea").val();

            if(content) {
                form.find(".post").attr("disabled", "disabled");

                $.post("/news/create/", {
                    content: content
                }, function(data) {
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

                    window.socketUtil.socket.emit("newsPost", data);
                });
            }
        } else {
            window.error.open("Login Required");
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
                    var post = $(data);
                    var comment = $("#post_" + parent + " .bottom .comment");
                    var count = parseInt(comment.attr("data-count")) + 1;
                    var counter = "Comment";

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
                });
            }
        } else {
            window.error.open("Login Required");
        }
    },
    like: function(element) {
        if(config.logged_in) {
            var post = element.parents(".post").attr("data-id");
            var like = !(element.attr("data-like") == "true");
            var count = parseInt(element.attr("data-count")) + ((like) ? 1 : -1);
            var counter = (like) ? "Unlike" : "Like";

            if(count > 0) {
                counter += " <strong>(" + count + ")</strong>";
            }

            element
                .html(counter)
                .attr({
                    "data-like": like,
                    "data-count": count
                });

            $.post("/news/" + post + "/like/", {
                like: like
            });

            window.socketUtil.socket.emit("newsLike", {
                like: like,
                post: post,
                reply: false
            });
        } else {
            window.error.open("Login Required");
        }
    },
    reply_like: function(element) {
        window.debug = element;

        if(config.logged_in) {
            var post = element.parents(".reply").attr("data-id");
            var like = !(element.attr("data-like") == "true");
            var count = parseInt(element.attr("data-count")) + ((like) ? 1 : -1);
            var counter = "";

            if(count > 0) {
                counter += " <strong>(" + count + ")</strong>";
            }

            element
                .html(((like) ? "Unlike" : "Like") + counter)
                .attr({
                    "data-like": like,
                    "data-count": count
                });

            $.post("/news/" + post + "/like/", {
                like: like
            });

            window.socketUtil.socket.emit("newsLike", {
                like: like,
                post: post,
                reply: true
            });
        } else {
            window.error.open("Login Required");
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
    comment: function(element) {
        element
            .parents(".post")
            .find(".comment .input")
            .focus();
    },
    group: function(element) {
        var activated = element.hasClass("activated");
        $(".groups .option").removeClass("activated");

        if(activated) {
            this.groups = null;
            element.removeClass("activated");
        } else {
            this.groups = element.attr("data-id");
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
        if(!$(".main .loader").is(":hidden")) {
            var bottom = ($(window).scrollTop() + $(window).height() > $(document).height() - 5);
            $(".loader").toggleClass("activated", bottom);

            if(bottom) {
                window.newsUtil.feed(window.newsUtil.page + 1);
            }
        }
    }
}
