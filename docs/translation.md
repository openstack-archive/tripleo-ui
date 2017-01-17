# Translation

tripleo-ui uses the react-intl package for translation.

## Adding translateable strings

Strings are prepared for translation using react-intl's `defineMessages`
API. Check out `./src/js/components/deployment_plan/` for examples.

## Extracting messages from components

Messages are extracted during the build process (`npm run build`) and stored in
the `./i18n/extracted-messages/` folder. These files can be converted into a
single `.pot` file with this command:

```
npm run json2pot
```

The resulting file (`./messages.pot`) can be uploaded to http://zanata.org to
create/update the translation.

## Using translated `.po` files

The translated language file (`messages.po`) then needs to be converted into one
JSON file per language (Japanese in this example):

```
npm run po2json -- messages.po -o ./i18n/locales/ja.json
```


## Adding a new language

The languages are defined in the `./src/js/components/i18n/I18NProvider`
component. To add another language, import the relevant locale data from the
react-intl packages, as well as the JSON containing the translation and add the
new language to the MESSAGES constant:

```js
import ja from 'react-intl/locale-data/ja';
import jaMessages from '../../../../i18n/locales/ja.json';

const MESSAGES = {
  ja: jaMessages.messages
};
```
