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

const fs = require('fs');
const babel = require('babel-core');
const _ = require('lodash');
const constants = './src/js/constants/i18n.js';

function getConstants() {
  const transformed = babel.transformFileSync(constants).code;
  const languageNames = eval(transformed).LANGUAGE_NAMES;
  delete languageNames['en'];
  return Object.keys(languageNames);
}

function getLocaleFiles() {
  return fs.readdirSync('i18n/locales').map(function(el) {
    return el.split('.')[0];
  });
}

function showError(constants, locales) {
  let diff, name;

  if (constants.length > locales.length) {
    diff = _.difference(constants, locales);
    name = 'Locales';
  } else {
    diff = _.difference(locales, constants);
    name = 'Constants';
  }

  console.log(name, 'is missing', diff.join(', '));
}

function main() {
  const constants = getConstants();
  const localeFiles = getLocaleFiles();

  if (constants.length !== localeFiles.length) {
    showError(constants, localeFiles);
    process.exit(1);
  }

}

main();
