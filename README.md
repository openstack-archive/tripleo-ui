# Development environment setup

Ideally, you should have one powerful machine ("virt host") on which you will install TripleO (the backend). For the development work on the TripleO UI, we recommend installing and configuring the UI directly on your workstation ("local machine") and then pointing it to the machine hosting the TripleO installation.

## Install TripleO

Do these steps on the virt host.

Follow the official docs to install and configure TripleO (follow the step up to and including the Undercloud installation):
http://docs.openstack.org/developer/tripleo-docs/index.html

Once the undercloud is installed, you will need to create a tunnel on your virt host, to make the services running on undercloud available to the UI:
```
ssh -N root@<undercloud_ip> -L 0.0.0.0:6385:192.0.2.1:6385 -L 0.0.0.0:5000:192.0.2.1:5000 -L 0.0.0.0:5001:192.0.2.1:5001 -L 0.0.0.0:8585:192.0.2.1:8585 -L 0.0.0.0:8004:192.0.2.1:8004 -L 0.0.0.0:8080:192.0.2.1:8080 -L 0.0.0.0:9000:192.0.2.1:9000 -L 0.0.0.0:8989:192.0.2.1:8989
```

### Install Validations

To install Validations as part of your undercloud, make sure `enable_validations` is set to `true` in `undercloud.conf`, prior to running `openstack undercloud install`.

## Install TripleO UI

Do these steps on the local machine.

Install nodejs and npm:
```
sudo dnf install nodejs
```

To compile and install native addons from npm you may also need to install build tools:
```
sudo dnf install gcc-c++ make
```

Clone the TripleO UI repo, change into the newly clone directory, install the dependencies and start the development server: 
```
git clone https://github.com/openstack/tripleo-ui.git
cd tripleo-ui
npm install
npm start
```

Optionally start Karma to run tests after every change:
```
npm run test:watch
```

Copy `dist/tripleo_ui_config.js.sample` to `dist/tripleo_ui_config.js`, uncomment the lines pertaining to OpenStack services (`keystone`, `tripleo`, etc), and add the urls where these services can be accessed (in this case, the IP address of the virt host). You can set values for the other services as well to override the values coming from the keystone serviceCatalog.

To access the UI, navigate to `http://localhost:3000/`

## Troubleshooting installation

In case of problems with the nodejs installation, refer to https://nodejs.org/en/download/package-manager/#enterprise-linux-and-fedora.

In case of errors during `npm install`, remove `node_modules` directory and clean npm cache, then run `npm install` again:
```
rm node_modules
npm cache clean
npm install
```


# Contributing

Use OpenStack Gerrit for patches and reviews (http://docs.openstack.org/infra/manual/developers.html).

1. `git clone https://github.com/openstack/tripleo-ui.git` (if you didn't already)
2. Install git-review: `sudo dnf install git-review`
3. Setup Gerrit: `git review -s`
4. Develop on feature-branch locally
5. Run `git review` to push patch for review.
6. Review and merge patches on OpenStack Gerrit: https://review.openstack.org/#/q/project:openstack/tripleo-ui


# Tests

## Single test run

- `npm test` (alternatively run `karma start --single-run`)
- `npm run lint` to run ESLint

Info on Linting setup: https://medium.com/@dan_abramov/lint-like-it-s-2015-6987d44c5b48
.eslintrc rules tweaks: http://blog.javascripting.com/2015/09/07/fine-tuning-airbnbs-eslint-config/

## Tests during development

Start Karma to run tests after every change ```npm run test:watch```

## Debugging tests

1. option:
  - use `console.log` in the test and see the output in karma server output
2. option:
  - install karma-chrome-launcher npm module `npm install karma-chrome-launcher --save-dev`
  - replace/add 'Chrome' to browsers in `karma.conf.js`
  - now Karma will launch Chrome to run the tests
  - use `debugger;` statement in test code to add breakpoints
  - in Karma Chrome window click 'debug' button and debug in chrome developer tools as usual
  - optionally you can use karma-jasmine-html-reporter for better test output (https://www.npmjs.com/package/karma-jasmine-html-reporter)
  - make sure you don't push those changes to `karma.conf.js` and `package.json` as part of your patch


# Style guide and conventions

Style guide: https://github.com/airbnb/javascript

Multiple words in folder names should be separated by an underscore:

```
src/js/components/environment_configuration
```


# Documentation

Use JSDoc docstrings in code to provide source for autogenerated documentation (http://usejsdoc.org/).


# Translation

tripleo-ui uses the react-intl package for translation.

## Extracting messages from source

Messages are extracted as part of the build process (`npm run build`) and can be found in the `./i18n/extracted-messages/` folder. These JSON-based files can be converted into a single `.pot` file with this command:

```
./node_modules/react-intl-po/lib/cli.js json2pot './i18n/extracted-messages/**/*.json' -o ./i18n/extracted-messages.pot
```

The resulting `.pot` file can be uploaded to http://zanata.org to create/update the translation.

## Using translated `.po` files

The translated language files (`.pot`) can then be converted back to one JSON file per language (Japanese in this example):

```
./node_modules/react-intl-po/lib/cli.js po2json 'japanese.po' -m './i18n/extracted-messages/**/*.json' -o 'i18n/locales/ja.json'
```

## Adding a new language

The languages are defined in the ./src/js/components/i18n/I18NProvider component. To add another language, import the relevant locale data from the react-intl packages, as well as the JSON containing the translation and add the new language to the MESSAGES constant:

```
import jaLocaleData from 'react-intl/locale-data/ja';
import jaMessages from '../../../../i18n/locales/ja.json';

const MESSAGES = {
  ja: jaMessages
};
```
