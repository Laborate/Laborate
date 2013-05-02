/* Modules */
var http    = require('http');
var express = require('express');
var routes  = require('./routes');
var app = express();

/* Configuration */
app.engine('html', require('ejs').renderFile);
app.set('port', 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public',  compress: true, optimization: 2 }));
app.use(express.static(__dirname + '/public'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/* Routes */
app.get('*[^.css]', routes.index);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
