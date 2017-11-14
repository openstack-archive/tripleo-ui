/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

'use strict';

var fs = require('fs');
var execSync = require('child_process').execSync;
var trim = require('lodash').trim;

function getVersion() {
  var packageContents = fs.readFileSync('./package.json', 'utf8');
  var packageJson = JSON.parse(packageContents);
  return packageJson.version;
}

function getGitSha() {
  return trim(execSync('git rev-parse --short HEAD', { encoding: 'utf8' }));
}

module.exports = {
  version: JSON.stringify(getVersion()),
  gitSha: JSON.stringify(getGitSha())
};
