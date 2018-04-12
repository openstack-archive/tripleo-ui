TripleO UI packaging
====================

TL;DR
-----

* We need people from the RDO team to approve all changes
* New packages are built on every upstream merge commit
* Use npm shrinkwrap when updating dependencies in ``package.json``

Upstream
--------

For upstream releases, we only provide a source tarball.  This is released via
the ``project-config`` machinery just like other TripleO projects.  The tarball is
produced by running ``npm pack`` in the root of the project, and excludes the
``node_modules`` directory.  The tarballs are available `here`_.

RDO
---

The upstream TripleO CI relies on packages provided by the `RDO project`_.
Therefore, it's important to keep the RDO packages up-to-date, and to prevent
the builds from failing.

The product of RDO packaging is a set of two RPMs:

* `openstack-tripleo-ui-deps`_
* `openstack-tripleo-ui`_

And of course, the second one depends on the first one.  The `-deps` package
contains the contents of the `node_modules` directory.

An RPM is created from a `.spec` file.  These files can be access via the above
GitHub links.  Any changes to the files are subject to review by the RDO team.
This can be a lengthy process because software licenses need to be reviewed.

RDO builds packages in two different streams: trunk and stable.  Study the
following graphic to understand how code flows through the pipeline:

.. image:: https://www.rdoproject.org/images/documentation/rdo-full-workflow-high-level-no-buildlogs.png
   :alt: RDO diagram

What to do when dependencies change
-----------------------------------

This applies both to adding *new* dependencies, and upgrading *existing* ones.

#.  Make the required changes in ``package.json``
#.  ``$ rm -rf node_modules``
#.  ``$ npm cache clean``
#.  ``$ npm install``
#.  ``$ npm shrinkwrap``
#.  Commit those changes along with your dependency changes in
    ``tripleo-ui``. In the commit message, add a link to the dependency
    (GitHub or similar), and indicate the project's license.
#.  When you submit the patch, the native npm jobs will pass but the
    undercloud gate job will fail because the dependency isn't yet in
    the `openstack-tripleo-ui-deps`_ package. This is expected. Have
    the patch be normally reviewed.
#.  Once it's about ready to merge, ask RDO to review the licensing.
#.  Update the `openstack-tripleo-ui-deps`_ package.  Currently, this
    is done by submitting a pull request on GitHub.  There are plans in
    place to move the workflow for this repository to the gerrit
    system.
#.  (Once per release) Update the `openstack-tripleo-ui`_ spec so that
    it points to the new version of `openstack-tripleo-ui-deps`_. This
    is done by submitting a patch via `gerrit`_.
#.  Recheck the patch. All jobs now pass.

.. _here: http://tarballs.openstack.org/tripleo-ui/
.. _openstack-tripleo-ui-deps: https://github.com/rdo-common/openstack-tripleo-ui-deps
.. _openstack-tripleo-ui: https://github.com/rdo-packages/tripleo-ui-distgit/tree/rpm-master
.. _RDO project: https://www.rdoproject.org
.. _gerrit: https://review.rdoproject.org
