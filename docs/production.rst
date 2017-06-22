Production
==========

Building for production
-----------------------

::

   $ npm run build

This will produce a minified and mangled file in ``dist/tripleo_ui.js``.  It
also enables React production mode.

Testing a production build locally
----------------------------------

::

   $ <kill your webpack-dev-server process>
   $ npm run build
   $ cd dist
   $ python -m SimpleHTTPServer 1111
   $ <go to http://localhost:1111 in the browser>
