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

/* I18nPlugin for Webpack
 * ======================
 *
 * This plugin is used to automatically enable all available languages.  It
 * looks in the "localePath" configuration variable (which in our case is
 * "i18n/locales"), and reads the files in that directory.  It then generates a
 * Javascript file with all the necessary imports and other useful objects.
 * This file is placed in "src/js/components/i18n/messages.js".  You can see a
 * sample of this file below.
 *
 * import deMessages from '../../../../i18n/locales/de.json';
 * import esMessages from '../../../../i18n/locales/es.json';
 *
 * import de from 'react-intl/locale-data/de';
 * import es from 'react-intl/locale-data/es';
 *
 * export const MESSAGES = {
 *   'de': deMessages['de'],
 *   'es': esMessages['es']
 * };
 *
 *
 * export const LOCALE_DATA = [...de, ...es];
 */

var fs = require('fs');
var prettier = require('prettier');

var I18nPlugin = function(options) {
  this.options = options;
};

I18nPlugin.prototype.apply = function(compiler) {
  var files = fs.readdirSync(this.options.localePath);
  var locales = files.map(function(file) {
    return file.replace('.json', '');
  });

  var localesLower = locales.map(function(locale) {
    return locale.toLowerCase().replace('-', '');
  });

  var localesSimple = locales.map(function(locale) {
    return locale.split('-')[0];
  });

  var messagesImport = localesSimple
    .map(function(locale, index) {
      var lower = localesLower[index];
      var full = locales[index];
      return (
        'import ' +
        lower +
        "Messages from '../../../../i18n/locales/" +
        full +
        ".json';"
      );
    })
    .join('\n');

  var reactIntlImport = localesSimple
    .map(function(locale, index) {
      return (
        'import ' + locale + " from 'react-intl/locale-data/" + locale + "';"
      );
    })
    .join('\n');

  var messages = locales
    .map(function(locale, index) {
      var lower = localesLower[index];
      return "'" + locale + "': " + lower + "Messages['" + locale + "']";
    })
    .join(',\n  ');

  var messagesObj = 'export const MESSAGES = {\n  ' + messages + '\n}';

  var localeData = localesSimple
    .map(function(locale) {
      return '...' + locale;
    })
    .join(', ');

  var localeDataObj = 'export const LOCALE_DATA = [' + localeData + '];';

  var file =
    messagesImport +
    '\n\n' +
    reactIntlImport +
    '\n\n' +
    messagesObj +
    '\n\n' +
    localeDataObj;

  file = prettier.format(file, { singleQuote: true });
  fs.writeFileSync('src/js/components/i18n/messages.js', file);
};

module.exports = I18nPlugin;
