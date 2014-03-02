window.newsUtil = {
    page: 0,
    loading: false,
    feed: function(page, groups, tags) {
        var _this = this;

        if(!_this.loading && page > _this.page) {
            _this.loading = true;

            $.get("/news/page/" + page + "/", {
                groups: groups || [],
                tags: tags || []
            }, function(data) {
                if(typeof data == "string") {
                    $(".main .posts").append(data);
                    _this.page += 1;
                } else {
                    $(".main .loader").fadeOut(200);
                }

                _this.loading = false;
            });
        }
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
            });
        }
    },
    sub_post: function(form) {
        var content = form.find(".input").val();
        var parent = form.find(".hidden").val();

        if(content) {
            $.post("/news/" + parent + "/reply/", {
                content: content
            }, function(data) {
                var post = $(data);
                post.hide().css("opacity", 0);

                $("#post_" + parent + " .replies")
                    .append(post)
                    .removeClass("hidden");

                post.slideDown(200);

                setTimeout(function() {
                    post.animate({ "opacity": 1}, 200)
                }, 250);

                form.find(".input").val("");
            });
        }
    },
    mention: function(element) {
        var post = element.parents(".post");
        var input = post.find(".comment .input");

        if(input.val()) {
            input.val(input.val() + " @" + post.attr("data-from"));
        } else {
            input.val("@" + post.attr("data-from"));
        }
    },
    group: function(element) {
        element.toggleClass("activated");
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
