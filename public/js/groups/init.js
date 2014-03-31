$(function(){
    $(".container.listing .info").vAlign();
    $(".container.profile .icon").vAlign().hAlign();

    $(".group-users canvas").each(function() {
        var data = JSON.parse($(this).attr("data-activity"));

        if(data.length != 0) {
            var max = Math.max.apply(null, data);
            var min = Math.min.apply(null, data);
            var scaler = (max - min)/100;

            var width = 5;
            var rightShift = 30;

            var canvas = $(this).get()[0];
            var graph = canvas.getContext("2d");
            graph.fillStyle="rgba(0, 0, 0, .05)";

            $.each(data, function(key, height) {
                height = height / scaler;
                graph.fillRect(rightShift, canvas.height - height, width, height);
                rightShift += width + 1;
            });
        } else {
            $(this).hide();
        }
    });
});
