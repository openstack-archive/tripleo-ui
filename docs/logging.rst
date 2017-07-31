Logging
=======

This document describes how logging works in tripleo-ui.

Collection
----------

Logs are collected by using the logging service.  The logging service has an API
similar to the ``console`` API in modern browsers.  This means that we can use
the standard "info", "warn", "error" semantics.

You can import the logging service like this:

.. code-block:: js

   import logger from './src/js/services/logging/LoggingService';

And then you can use the logger object directly.

.. code-block:: js

   logger.error('Something bad happened.')

Logs are collected to two different places: the browser console and a Zaqar
queue on the undercloud.  This is done via logging adapters in
``src/js/services/logging/adapters``.  Adapters share a common API and allow us
to send logging data to multiple destinations, and to enable and disable them
based on our needs.

We collect standard logging data via logging statements introduced to our code
by application developers.  In addition to that, we collect data via the
redux-logger mechanism.  This records application state changes, and the
application state itself.

Configuration
-------------

Logging can be configured in the ``tripleo_ui_config.js`` file.  You can enable
or disable certain loggers in the ``loggers`` array, and you can change the name
of the Zaqar queue where your messages will be sent.  By default, the name of
the queue is different from the normal TripleO queue to avoid any conflicts.

Storage
-------

Once messages arrive in the configured Zaqar queue, they wait to be persisted in
Swift.  Once an hour, a cron-triggered Mistral workflow drains the queue,
formats the messages into log lines, and persists them in a Swift object.  This
object lives in a container called ``tripleo-ui-logs``.

The Mistral workflow also checks if the log file has reached or exceeded 10MB in
size, and if so, it will rotate the log.

Retrieval
---------

Logs can be retrieved from Swift by using the Debug part of the interface.  It
can be accessed from the navbar in the upper right corner.  You request the
logs, and Mistral will gather them for you, put them in a tar archive, and make
them available at a temporary Swift url for you to download.

Logs are also included in sosreports.
