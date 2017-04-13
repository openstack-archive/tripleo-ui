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

const fs = require('fs');

class I18nPlugin {

  constructor(options) {
    this.options = options;
  }

  apply(compiler) {

    let files = fs.readdirSync(this.options.localePath);
    let locales = files.map((file) => file.replace('.json', ''));
    let localesLower = locales.map((locale) => locale.toLowerCase().replace('-', ''));
    let localesSimple = locales.map((locale) => locale.split('-')[0]);

    let messagesImport = localesSimple.map((locale, index) => {
      let lower = localesLower[index];
      let full = locales[index];
      return `import ${lower}Messages from '../../../../i18n/locales/${full}.json';`;
    }).join('\n');

    let reactIntlImport = localesSimple.map((locale, index) => {
      return `import ${locale} from 'react-intl/locale-data/${locale}';`;

    }).join('\n');

    let messages = locales.map((locale, index) => {
      let lower = localesLower[index];
      return `'${locale}': ${lower}Messages['${locale}']`;
    }).join(',\n  ');

    let messagesObj = `export const MESSAGES = {
${messages}
};`;

    let localeData = localesSimple.map((locale) => `...${locale}`).join(', ');
    let localeDataObj = `export const LOCALE_DATA = [${localeData}];`;

    let file = `${messagesImport}

${reactIntlImport}

${messagesObj}

${localeDataObj}`;

    fs.writeFileSync('src/js/components/i18n/messages.js', file);

  }

}

module.exports = I18nPlugin;
