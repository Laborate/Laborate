window.newsUtil = {
    feed: function(page, groups, tags) {
        $.ajax({
            url: "/news/posts/" + page + "/",
            data: {
                groups: groups || [],
                tags: tags || []
            },
            success: function(data) {
                if(typeof data == "string") {
                    $(".main .posts").append(data);
                } else {
                    $(".main .loader").fadeOut(200);
                }
            }
        });
    },
    preview: function(preview, form) {
        $(".main .container > .form .preview").toggleClass("activated", preview);

        if(preview) {
            $.ajax({
                type: "post",
                url: "/news/post/preview",
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

            $.ajax({
                type: "post",
                url: "/news/post/create",
                data: {
                    content: content
                },
                success: function(data) {
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
                }
            });
        }
    },
    group: function(element) {
        element.toggleClass("activated");
    },
    scroll: function() {
        if(!$(".main .loader").is(":hidden")) {
            var bottom = ($(window).scrollTop() + $(window).height() > $(document).height() - 10);
            $(".loader").toggleClass("activated", bottom);

            if(bottom) {
                window.newsUtil.feed((Math.ceil($(".posts .post").length/11) + 1));
            }
        }
    }
}
