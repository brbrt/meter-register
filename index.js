var bodyParser = require('body-parser');
var express = require('express');
var expressHbs = require('express-handlebars');
var path = require('path');
var log = require('winston');

var config = require('./config.js');

var app = express();

app.set('views', path.resolve(__dirname + '/views'));
app.set('view engine', 'hbs');
app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'index.hbs', layoutsDir:app.get('views')}));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
    var data = {name: 'stranger'};
    res.render('hello', data);
});


var server = app.listen(config('port'), function () {
    var host = server.address().address;
    var port = server.address().port;

    log.info('meter-register app listening at http://%s:%s', host, port);
});