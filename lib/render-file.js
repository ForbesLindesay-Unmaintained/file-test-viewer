'use strict';

var fs = require('fs');
var path = require('path');
var Promise = require('promise');
var escapeHtml = require('escape-html');
var getResult = require('./get-result.js');

var html = fs.readFileSync(__dirname + '/file.html', 'utf8');

module.exports = renderFile;
function renderFile(dirname, reqPath, options) {
  return getResult(path.join(dirname, reqPath), options).then(function (testCase) {
    testCase.name = reqPath;
    return html.replace(/\{\{test-case\}\}/g, escapeHtml(JSON.stringify(testCase)));
  });
};