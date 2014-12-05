'use strict';

var fs = require('fs');
var path = require('path');
var Promise = require('promise');

var readFile = Promise.denodeify(fs.readFile);

module.exports = getResult;
function getResult(filename, options) {
  var input = readFile(filename, 'utf8');
  var expected = readFile(options.expected(filename), 'utf8');
  var actual = readFile(options.actual(filename), 'utf8');
  return Promise.all([input, expected, actual]).then(function (results) {
    return {
      name: path.basename(filename),
      filename: filename,
      input: results[0],
      expected: results[1],
      actual: results[2],
      passed: results[1].trim() === results[2].trim()
    };
  }, function (err) {
    return Promise.all([input, expected]).then(function (results) {
      return {
        name: path.basename(filename),
        filename: filename,
        input: results[0],
        expected: results[1],
        actual: 'ENOENT',
        passed: false
      };
    });
  });
}