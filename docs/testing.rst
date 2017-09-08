Testing
=======

Single test run
---------------

- ``npm test`` (alternatively run ``karma start --single-run``)
- ``npm run lint`` to run `prettier`_

.. _prettier: https://github.com/prettier/prettier

Tests during development
------------------------

Start Karma to run tests after every change ``npm run test:watch``.

Testing a production build locally
----------------------------------

::

   $ <kill your webpack-dev-server process>
   $ npm run build
   $ cd dist
   $ python -m SimpleHTTPServer 1111
   $ <go to http://localhost:1111 in the browser>

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
