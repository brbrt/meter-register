var util = require('util');
var moment = require('moment');
var q = require('q');
var _ = require('lodash');

var config = require('./config.js');
var storage = require('./storage.js');

module.exports = {
    save: save,
    getLatest: getLatest,
    getInterval: getInterval
};

function save(data) {
    var deferred = q.defer();

    var errors = checkSaveData(data);

    if (errors) {
        deferred.reject(errors);
    } else {
        data.value = parseFloat(data.value);
        storage.save(data);
        deferred.resolve('OK');
    }

    return deferred.promise;
}

function checkSaveData(data) {
    var result = checkValue(data.value);
    return result;
}

function checkValue(valueStr) {
    var value = parseFloat(valueStr);

    if (isNaN(value)) {
        return 'Invalid value.';
    }

    return '';
}

function getLatest() {
    return getLastDay().then(getLastUnique);
}

function getLastUnique(data) {
    if (data.length === 0) {
        return null
    }
    return data[data.length - 1];
}

function getInterval(from, to) {
    var format = 'YYYY-MM-DD';

    var start = moment(from, format).startOf('day');
    var end = moment(to, format).startOf('day');

    if (!start.isValid() || !end.isValid()) {
        return q.fcall(function error() {
            throw new Error('Invalid input.');
        });
    }

    var prs = [];

    while (start.isBefore(end) || start.isSame(end)) {
        var pr = storage.get(start.toDate());
        prs.push(pr);
        start.add(1, 'days');
    }

    return q.all(prs)
        .then(combineArrays);
}

function combineArrays(arrays) {
    return Array.prototype.concat.apply([], arrays);
}
