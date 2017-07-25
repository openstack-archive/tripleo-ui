Installation
============

Development environment setup
-----------------------------

Ideally, you should have one powerful machine ("virt host") on which you will
install TripleO (the backend). For the development work on the TripleO UI, we
recommend installing and configuring the UI directly on your workstation ("local
machine") and then pointing it to the machine hosting the TripleO installation.

Install TripleO
---------------

Do these steps on the virt host.

Follow the `official docs`_ to install and configure TripleO (follow the step up to
and including the Undercloud installation).

.. _official docs: https://docs.openstack.org/tripleo-docs/latest/

Once the undercloud is installed, you will need to create a tunnel on your virt
host, to make the services running on undercloud available to the UI. The tunnel
has the following format:

::

    ssh -N root@<undercloud_ip> \
      -L 0.0.0.0:<service_port>:<service_ip>:<service_port>
      # Repeat the last line for each service.

If you installed the UI with SSL the ``service_ip`` is the value of
``undercloud_public_ip`` in undercloud.conf.  The ports needed are: 13385,
13000, 13004, 13808, 9000, 13989 and 443.

If you installed the UI **without** SSL, the ``service_ip`` is the value of
``network_gateway`` in undercloud.conf.  The ports needed are: 6385, 5000, 8004,
8080, 9000, 8989 and 3000.

Example (with SSL enabled):

::

    ssh -N root@192.168.122.205 \
      -L 0.0.0.0:13385:192.0.2.2:13385 \
      -L 0.0.0.0:13000:192.0.2.2:13000 \
      -L 0.0.0.0:13004:192.0.2.2:13004 \
      -L 0.0.0.0:13808:192.0.2.2:13808 \
      -L 0.0.0.0:9000:192.0.2.2:9000 \
      -L 0.0.0.0:13989:192.0.2.2:13989 \
      -L 0.0.0.0:443:192.0.2.2:443

Example (without SSL):

::

    ssh -N root@192.168.122.205 \
      -L 0.0.0.0:6385:192.0.2.1:6385 \
      -L 0.0.0.0:5000:192.0.2.1:5000 \
      -L 0.0.0.0:8004:192.0.2.1:8004 \
      -L 0.0.0.0:8080:192.0.2.1:8080 \
      -L 0.0.0.0:9000:192.0.2.1:9000 \
      -L 0.0.0.0:8989:192.0.2.1:8989 \
      -L 0.0.0.0:3000:192.0.2.1:3000

Install Validations
-------------------

To install Validations as part of your undercloud, make sure
``enable_validations`` is set to ``true`` in ``undercloud.conf``, prior to
running ``openstack undercloud install``.

Install TripleO UI
------------------

Do these steps on the local machine.

Install nodejs and npm:

::

    sudo dnf install nodejs

To compile and install native addons from npm you may also need to install build
tools:

::

    sudo dnf install gcc-c++ make

Clone the TripleO UI repo, change into the newly clone directory, install the
dependencies and start the development server:

::

    git clone https://github.com/openstack/tripleo-ui.git
    cd tripleo-ui
    npm install
    npm start

Optionally start Karma to run tests after every change:

::

    npm run test:watch

Create the ``dist/`` directory, and copy ``config/tripleo_ui_config.js.sample``
to ``dist/tripleo_ui_config.js``.  Uncomment the lines pertaining to OpenStack
services (``keystone``, ``tripleo``, etc), and add the urls where these services
can be accessed (in this case, the IP address of the virt host). You can set
values for the other services as well to override the values coming from the
keystone serviceCatalog.

::

    mkdir dist
    cp config/tripleo_ui_config.js.sample dist/tripleo_ui_config.js

To access the UI, navigate to ``http://localhost:3000/``

Troubleshooting installation
----------------------------

In case of problems with the nodejs installation, refer to this `guide`_.

.. _guide: https://nodejs.org/en/download/package-manager/#enterprise-linux-and-fedora

In case of errors during ``npm install``, remove ``node_modules`` directory and
clean npm cache, then run ``npm install`` again:

::

    rm -rf node_modules
    npm cache clean
    npm install
