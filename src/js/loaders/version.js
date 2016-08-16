'use strict';

var fs = require('fs');

function getVersion() {
  var packageContents = fs.readFileSync('./package.json', 'utf8');
  var packageJson = JSON.parse(packageContents);
  return packageJson.version;
}

function getStringToInput() {
  let version = getVersion();
  return `
  window.tripleOUiConfig = window.tripleOUiConfig || {};
  window.tripleOUiConfig.version = '${version}';
  `;
}

module.exports = function(content) {
  content = content + getStringToInput();
  return content;
};
