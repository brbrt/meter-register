var bodyParser = require('body-parser');
var express = require('express');
var expressHbs = require('express-handlebars');
var path = require('path');
var log = require('winston');

var config = require('./config.js');
var service = require('./service.js');

var app = express();

app.set('views', path.resolve(__dirname + '/views'));
app.set('view engine', 'hbs');
app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'index.hbs', layoutsDir:app.get('views')}));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
    service
        .getInterval('2016-01-01', '2016-03-01')
        .then(function success(data) {
            log.debug('List reading result: ' + require('util').inspect(data));
            res.render('list', {readings: data});
        })
        .catch(function error(err) {
            res.status(500);
            res.send(err);
        });

});

app.post('/reading', function (req, res) {
    log.debug('Got new reading from ' + req.ip, req.body);

    var data = {
        time: new Date(),
        value: req.body.value,
        meterId: req.body.meterId || 'Default'
    };

    service.save(data).then(
        function success(data) {
            res.send(data + '\n');
        },
        function error(err) {
            apiError(err, res);
        }
    );
});


var server = app.listen(config('port'), function () {
    var host = server.address().address;
    var port = server.address().port;

    log.info('meter-register app listening at http://%s:%s', host, port);
});