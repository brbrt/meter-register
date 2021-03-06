var fs = require('fs');
var path = require('path');
var util = require('util');
var mkdirp = require('mkdirp');
var moment = require('moment');
var q = require('q');

var config = require('./config.js');

module.exports = {
    save: save,
    get: get
};

var timeFormat = 'YYYY-MM-DDTHH:mm:ss.SSS';
var separator = ';';
var lineSeparator = '\n';

function save(data) {
    var row = createRow(data);
    var df = calculateFileName(data.time);

    mkdirp(df.dir, function mkdirdone(err) {
        if (err) {
            log.error('Error creating dir: ' + err);
            return;
        }

        fs.appendFile(path.resolve(df.dir, df.file), row, function done(err) {
            if (err) {
                log.error('Error writing data: ' + err);
            }
        });
    });
}

function get(date) {
    var df = calculateFileName(date);
    return readFile(path.resolve(df.dir, df.file)).then(parseFile);
}

function readFile(fileName) {
    var deferred = q.defer();

    fs.readFile(fileName, 'utf8', function done(err, fileData) {
        if (err) {
            fileData = '';
        }
        deferred.resolve(fileData);
    });

    return deferred.promise;
}

function parseFile(fileData) {
    var result = [];

    var lines = fileData.split(lineSeparator);

    for (var i = 0; i < lines.length; i++) {
        var parsed = parseRow(lines[i]);
        if (parsed) {
            result.push(parsed);
        }
    }

    return result;
}

function createRow(data) {
    var parts = [
        moment(data.time).format(timeFormat),
        data.meterId,
        data.value
    ];

    return parts.join(separator) + lineSeparator;
}

function parseRow(row) {
    var parts = row.split(separator);

    if (parts.length < 3) {
        return null;
    }

    return {
        time: moment(parts[0], timeFormat).toDate(),
        meterId: parts[1],
        value: parseFloat(parts[2])
    };
}

function calculateFileName(time) {
    var mtime = moment(time);

    return {
        dir: path.resolve(__dirname, config('storagePath'), mtime.format('YYYY/MM')),
        file: mtime.format('YYYY-MM-DD') + '.csv'
    };
}
