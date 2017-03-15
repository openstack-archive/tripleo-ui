Translation
===========

Tripleo UI uses the react-intl package for translation.

Adding translateable strings
----------------------------

Strings are prepared for translation using react-intl's ``defineMessages``
API. Check out ``./src/js/components/deployment_plan/`` for examples.

Extracting messages from components
-----------------------------------

Messages are extracted during the build process (``npm run build``) and stored
in the ``./i18n/extracted-messages/`` folder. These files can be converted into
a single ``.pot`` file with this command:

::

    npm run json2pot

The resulting file (``./i18n/messages.pot``) can be uploaded to
`Zanata`_ to create/update the translation. (Note: translations for the
TripleO UI are synced from the `OpenStack Zanata`_ instance.)

.. _Zanata: http://zanata.org
.. _OpenStack Zanata: https://translate.openstack.org/project/view/tripleo-ui

Using translated ``.po`` files
------------------------------

The translated language file (``messages.po``) then needs to be converted into
one JSON file per language (Japanese in this example):

::

    npm run po2json -- ./i18n/ja.po -o ./i18n/locales/ja.json


Adding a new language
---------------------

The languages are defined and activated in 3 places. Additionally, the
puppet-tripleo module also needs to be updated for users installing the
UI via the ``openstack undercloud install`` command.


1. The ``I18nProvider`` component
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

To add a new language, import the relevant locale data from the ``react-intl``
package, as well as the JSON file which contains the translation. The new
language then needs to be added to the ``MESSAGES`` constant and the
constructor. Here's an example for Japanese ("ja"):

.. code-block:: js

    // ./src/js/components/i18n/I18nProvider

    import ja from 'react-intl/locale-data/ja';
    import jaMessages from '../../../../i18n/locales/ja.json';

    const MESSAGES = {
      'ja': jaMessages['ja']
    };

    class I18nProvider extends React.Component {
      constructor() {
        super();
        addLocaleData([...ja]);
      }


2. The language selector in the navigation bar
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

The language selector component contains a JS object with a display name for
each language. Please use the English translation for the selector:

.. code-block:: js

    // ./src/js/components/i18n/I18nDropdown

    const languages = {
      'en': 'English',
      'ja': 'Japanese'
    };


3. The ``tripleo-ui`` configuration file
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Finally, you can choose which languages are offered to the user by adding them
to the ``tripleo_ui_config.js`` file:

.. code-block:: js

    // Languages
    // If you choose more than one language, a language switcher
    // will appear in the navigation bar.
    "languages": ["en", "ja"],


The last step is useful if a language has not -- or only partially -- been
translated yet. In this case an incomplete language can be defined in the app as
part of a regular release, but will not show up in the selector by default. Once
the language translation has been completed it can more easily be backported
mid-release by updating only the corresponding JSON file.

4. The puppet UI manifest
~~~~~~~~~~~~~~~~~~~~~~~~~

When deploying the UI as part of a normal undercloud install, the
configuration file is created and managed by the `puppet-tripleo`_
module. The `manifest for the UI`_ must be modified in two places:

.. code-block:: puppet

    # ./manifests/ui.pp

    # [*enabled_languages*]
    #  Which languages to show in the UI.
    #  An array.
    #  Defaults to ['en', 'ja']

    [...]

    $enabled_languages        = ['en', 'ja'],


.. _puppet-tripleo: http://git.openstack.org/cgit/openstack/puppet-tripleo
.. _manifest for the UI: http://git.openstack.org/cgit/openstack/puppet-tripleo/tree/manifests/ui.pp
