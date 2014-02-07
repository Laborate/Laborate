$(function() {
    window.socketUtil.socket.emit("terminalJoin", function() {
        var term = new Terminal({
            cols: 80,
            rows: 24,
            useStyle: true,
            screenKeys: true
        });

        term.on('data', function(data) {
            window.socketUtil.socket.emit('terminalData', data);
        });

        window.socketUtil.socket.on('terminalData', function(data) {
            term.write(data);
        });

        window.socketUtil.socket.on('disconnect', function() {
            term.destroy();
        });

        term.open(document.body);
    });
});
