var express = require('express'),
    consolidate = require('consolidate'),
    http = require('http'),
    favicon = require('serve-favicon'),
    path = require('path');

var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

var port = process.env.PORT || 3000;
app.set('port', port);

var routes = require('./routes/index');
app.use('/', routes);
app.use(express.static(path.join(__dirname, 'public')));

app.engine('.html', consolidate.swig);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

var server = http.createServer(app);

server.listen(port, function(){
    console.log('Listening port...');
});