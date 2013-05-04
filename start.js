var forever = require('forever-monitor');

var child = new (forever.Monitor)('server.js', {
max: 3,
silent: false,
watch: true,
watchDirectory: '.',
//env: { 'NODE_ENV': 'production' }
});

child.start();