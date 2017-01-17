Testing
=======

Single test run
---------------

- ``npm test`` (alternatively run ``karma start --single-run``)
- ``npm run lint`` to run ESLint

`Info on linting setup`_ and `.eslintrc rules tweaks`_.

.. _Info on linting setup: https://medium.com/@dan_abramov/lint-like-it-s-2015-6987d44c5b48
.. _.eslintrc rules tweaks: http://blog.javascripting.com/2015/09/07/fine-tuning-airbnbs-eslint-config/

Tests during development
------------------------

Start Karma to run tests after every change ``npm run test:watch``.

Debugging tests
---------------

1. option

  - use ``console.log`` in the test and see the output in karma server output

2. option

  - install karma-chrome-launcher npm module
    ``npm install karma-chrome-launcher --save-dev``
  - replace/add 'Chrome' to browsers in ``karma.conf.js``
  - now Karma will launch Chrome to run the tests
  - use ``debugger;`` statement in test code to add breakpoints
  - in Karma Chrome window click 'debug' button and debug in chrome developer
    tools as usual
  - optionally you can use `karma-jasmine-html-reporter`_ for better test output
  - make sure you don't push those changes to ``karma.conf.js`` and
    ``package.json`` as part of your patch

.. _karma-jasmine-html-reporter: https://www.npmjs.com/package/karma-jasmine-html-reporter
