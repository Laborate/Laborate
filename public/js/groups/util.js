window.groupsUtil = {
    timer: null,
    create: function(form) {
        var _this = window.groupsUtil;
        var submit = form.find("input[type=submit]")
                        .val("loading...")
                        .addClass("disabled");

        $.post(form.attr("action"), {
            _csrf: window.config.csrf,
            name: form.find(".input").val(),
            description: form.find(".textarea").val(),
        }, function(data) {
            if(data.success) {
                window.location.href = "/groups/" + data.group + "/";
            } else {
                submit
                    .val(data.error_message)
                    .addClass("error")
                    .removeClass("disabled");

                clearInterval(_this.timer);
                _this.timer = setTimeout(function() {
                    submit.val(submit.attr("data-original")).removeClass("error");
                }, 5000);
            }
        });
    }
}
