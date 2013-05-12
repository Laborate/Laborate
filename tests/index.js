var tests = []
tests.push(require("./mysql")());

interval = setInterval(function() {
    var stop = true;

    for(var i in tests) {
        if(tests[i] == false) {
            process.exit(1);
        } else if(tests[i] == undefined) {
            stop = false;
        }
    }

    if(stop) {
        process.exit(0);
    }

}, 1);

