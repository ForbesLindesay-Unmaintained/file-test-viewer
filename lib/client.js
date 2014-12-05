'use strict';

var difflib = require('jsdifflib');
var unescape = require('unescape-html');

var container = document.getElementById('container');
var testCase = JSON.parse(unescape(document.getElementById('test-case').innerHTML));

var heading = document.createElement('h1');
heading.textContent = testCase.name;
container.appendChild(heading);

var alert = document.createElement('div');
alert.setAttribute('class', 'alert alert-' + (testCase.passed ? 'success' : 'danger'));
alert.textContent = (testCase.passed ? 'passed' : 'failed');
container.appendChild(alert);

var headingInput = document.createElement('h2');
headingInput.textContent = 'Input';
container.appendChild(headingInput);

function code(src) {
  var pre = document.createElement('pre');
  var code = document.createElement('code');
  pre.appendChild(code);
  code.textContent = src;
  hljs.highlightBlock(pre);
  return pre;
}
container.appendChild(code(testCase.input));


var headingResults = document.createElement('h2');
headingResults.textContent = testCase.passed ? 'Output' : 'Results';
container.appendChild(headingResults);



var btnGroup = document.createElement('div');
btnGroup.setAttribute('class', 'btn-group');
var tabContainer = document.createElement('div');
tabContainer.style.marginTop = '15px';
var buttons = [];
var tabs = [];
function button(text, handler, active) {
  var btn = document.createElement('button');
  btn.textContent = text;
  btn.addEventListener('click', function () {
    buttons.forEach(function (btn) {
      btn.setAttribute('class', 'btn btn-default');
    });
    btn.setAttribute('class', 'btn btn-default active');
    handler();
  }, false);
  if (active) btn.setAttribute('class', 'btn btn-default active');
  else btn.setAttribute('class', 'btn btn-default');
  buttons.push(btn);
  btnGroup.appendChild(btn);
}

function tab(text, content, active) {
  var tab = document.createElement('div');
  if (!active) tab.style.display = 'none';

  tab.appendChild(content);
  tabContainer.appendChild(tab);
  tabs.push(tab);
  
  button(text, function () {
    tabs.forEach(function (tab) {
      tab.style.display = 'none';
    });
    tab.style.display = 'block';
  }, active);
}

if (testCase.passed) {
  container.appendChild(code(testCase.actual));
} else {
  tab('Inline Diff', difflib.buildView({
    baseText: testCase.expected,
    newText: testCase.actual,
    // set the display titles for each resource
    baseTextName: "Expected",
    newTextName: "Actual",
    contextSize: 10,
    //set inine to true if you want inline
    //rather than side by side diff
    inline: true
  }), true);
  tab('Side by Side Diff', difflib.buildView({
    baseText: testCase.expected,
    newText: testCase.actual,
    // set the display titles for each resource
    baseTextName: "Expected",
    newTextName: "Actual",
    contextSize: 10,
    //set inine to true if you want inline
    //rather than side by side diff
    inline: false
  }));

  tab('Expected', code(testCase.expected));
  tab('Actual', code(testCase.actual));

  container.appendChild(btnGroup);
  container.appendChild(tabContainer);
}