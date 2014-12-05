'use strict';

var fs = require('fs');
var path = require('path');
var Promise = require('promise');
var getResult = require('./get-result.js');

var html = fs.readFileSync(__dirname + '/directory.html', 'utf8');

var readdir = Promise.denodeify(fs.readdir);
var stat = Promise.denodeify(fs.stat);

module.exports = renderDirectory;
function renderDirectory(dirname, reqPath, options) {
  return readdir(path.join(dirname, reqPath)).then(function (files) {
    return Promise.all(files.filter(function (filename) {
      return options.input(path.join(dirname, reqPath, filename));
    }).map(function (filename) {
      return getResult(path.join(dirname, reqPath, filename), options);
    }));
  }).then(function (tests) {
    tests = tests.map(function (test) {
      var href = reqPath + (reqPath[reqPath.length - 1] === '/' ? '' : '/') + test.name;
      return '<tr class="' + (test.passed ? 'success' : 'danger') + '">' +
        '<td style="width: 30px; text-align: center">' +
        '<a href="' + href + '"><span class="glyphicon glyphicon-' +
        (test.passed ? 'ok' : 'remove') +
        '"></span></a></td>' +
        '<td><a href="' + href + '">' + test.name + '</a></td>' +
        '</tr>';
    });
    return html.replace(/\{\{entries\}\}/g, tests.join('\n'))
               .replace(/\{\{name\}\}/g, reqPath);
  });
};