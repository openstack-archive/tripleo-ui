#!/usr/bin/env node
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

var readline = require('readline');
var REQUIRED_VERSION = 3;

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

var input = "";

rl.on('line', function (line) {
  input += line;
});

rl.on('close', function() {
  var npmVersion = JSON.parse(input).npm;
  var majorVersion = parseInt(npmVersion.split('.')[0], 0);

  if (majorVersion !== REQUIRED_VERSION) {
    console.error(
      'ERROR: incorrect version of npm!  Needed: 3, detected:',
      majorVersion
    );
    process.exit(1);
  }
});
