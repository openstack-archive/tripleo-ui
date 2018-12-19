Contributing
============

Use `OpenStack Gerrit`_ for patches and reviews.

1. ``git clone https://github.com/openstack/tripleo-ui.git``
2. Install git-review: ``sudo dnf install git-review``
3. Setup Gerrit: ``git review -s``
4. Develop on a feature branch locally (If code will close a bug, consider
   branch name of 'bug/123456')
5. Commit your changes and follow `best practices on OpenStack Wiki`_
   while writing commit message
6. Run ``git review`` to push your patch up for review
7. `Review and merge patches`_ on OpenStack Gerrit

.. _OpenStack Gerrit: https://docs.openstack.org/infra/manual/developers.html
.. _best practices on OpenStack Wiki: https://wiki.openstack.org/wiki/GitCommitMessages
.. _Review and merge patches: https://review.openstack.org/#/q/project:openstack/tripleo-ui
