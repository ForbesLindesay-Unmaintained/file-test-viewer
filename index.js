'use strict';

var path = require('path');
var fs = require('fs');
var express = require('express');
var browserify = require('browserify-middleware');
var renderDirectory = require('./lib/render-directory');
var renderFile = require('./lib/render-file');


function server(dirname, options) {
  var app = express();
  
  app.get('/file-test-viewer/client.js', browserify(__dirname + '/lib/client.js'));
  app.use(function (req, res, next) {
    var filename = path.join(dirname, req.path);
    fs.stat(filename, function (err, stat) {
      if (err) return next();
      if (stat.isDirectory()) {
        renderDirectory(dirname, req.path, options).done(function (html) {
          res.send(html);
        }, next);
      } else if (stat.isFile()) {
        renderFile(dirname, req.path, options).done(function (html) {
          res.send(html);
        }, next);
      }
    });
  });
  
  app.listen(3000);
}

server(path.resolve(__dirname + '/../jade-parser/test/cases'), {
  input: function (filename) { return /\.tokens\.json$/.test(filename) },
  expected: function (filename) { return filename.replace(/\.tokens\.json$/, '.expected.json'); },
  actual: function (filename) { return filename.replace(/\.tokens\.json$/, '.actual.json'); },
});