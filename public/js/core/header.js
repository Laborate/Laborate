$(function() {
    var counter;

    function setTimer() {
        clearTimeout(counter);
        setTimeout(function() {
            if($(".header .dropdown").has(":hover").length == 0) {
                $(".header .dropdown").removeClass("activated");
                clearTimeout(counter);
            } else {
                setTimer();
            }
        }, 5000);
    }

    $(".header .app:not(.coming-soon)").click(function() {
         $(".header .app").removeClass("activated");
         $(this).addClass("activated");
    });

    $(".header").on("mouseover", ".gravatar", function() {
         $(".header .dropdown").addClass("activated");
         setTimer();
    });

    $(".header .dropdown").on("mouseleave", function() {
         $(".header .dropdown").removeClass("activated");
         clearTimeout(counter);
    });

    $(".header .search .icon").click(function(e) {
        e.stopPropagation();
        $(".header .search .input").val("");

        if($(".header .search").hasClass("activated")) {
            $(".header .search").removeClass("activated");

            setTimeout(function() {
                $(".header .profile, .header .notifications").fadeIn(200);
            }, 300);
        } else {
            $(".header .profile, .header .notifications").fadeOut(200);

            setTimeout(function() {
                $(".header .search").addClass("activated");
                $(".header .search .input").focus();
            }, 250);
        }
    });

    $(".header .search .input").click(function(e) {
        e.stopPropagation();
    });

    $("body").click(function() {
        if($(".header .search").hasClass("activated")) {
            $(".header .search").removeClass("activated");

            setTimeout(function() {
                $(".header .profile, .header .notifications").fadeIn(200);
            }, 300);
        }
    });
});
