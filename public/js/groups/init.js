$(function(){
    $(".container.listing .hovered").vAlign().hAlign();
    $(".container.profile .icon").vAlign().hAlign();
    $(".container.profile .add-groups").vAlign();

    $(".group-users canvas").each(function() {
        var data = JSON.parse($(this).attr("data-activity"));

        if(data.length != 0) {
            var max = Math.max.apply(null, data);
            var min = Math.min.apply(null, data);
            var scaler = (max - min)/100;

            var width = 15;
            var rightShift = 130;

            var canvas = $(this).get()[0];
            var graph = canvas.getContext("2d");

            canvas.width = $(this).width() * 2;
            canvas.heigth = $(this).height() * 2;

            graph.beginPath();
            graph.fillStyle="rgba(0, 0, 0, .04)";

            $.each(data, function(key, height) {
                height = height / scaler;
                graph.rect(rightShift, canvas.height - height, width, height);
                rightShift += width + 2;
            });

            graph.fill();
        } else {
            $(this).hide();
        }
    });
});
