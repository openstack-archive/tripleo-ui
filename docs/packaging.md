# TripleO UI packaging

## TL;DR

* We need people from the RDO team to approve all changes
* New packages are built on every upstream merge commit
* Use npm shrinkwrap when updating dependencies in `package.json`

## Upstream

For upstream releases, we only provide a source tarball.  This is released via
the `project-config` machinery just like other TripleO projects.  The tarball is
produced by running `npm pack` in the root of the project, and excludes the
`node_modules` directory.  The tarballs are available [here][tarballs].

## RDO

The upstream TripleO CI relies on packages provided by the [RDO project][rdo].
Therefore, it's important to keep the RDO packages up-to-date, and to prevent
the builds from failing.

The product of RDO packaging is a set of two RPMs:

* `openstack-tripleo-ui-deps` [GitHub][deps]
* `openstack-tripleo-ui` [GitHub][rpm]

And of course, the second one depends on the first one.  The `-deps` package
contains the contents of the `node_modules` directory.

An RPM is created from a `.spec` file.  These files can be access via the above
GitHub links.  Any changes to the files are subject to review by the RDO team.
This can be a lengthy process because software licenses need to be reviewed.

RDO builds packages in two different streams: trunk and stable.  Study the
following graphic to understand how code flows through the pipeline:

![RDO workflow diagram][diagram]

## What to do when dependencies change

This applies both to adding *new* dependencies, and upgrading *existing* ones.

1.  Make the required changes in `package.json`
2.  `$ rm -rf node_modules`
3.  `$ npm cache clean`
4.  `$ npm install`
5.  `$ npm shrinkwrap`
6.  Commit those changes along with your dependency changes in `tripleo-ui`.
    Your patch should only include the necessary changes to update the
    dependency.  Submit another patch for your feature/bugfix.  In the
    commit message, add a link to the dependency (GitHub or similar), and
    indicate the project's license.  We use the "workflow" field on this
    patch to indicate whether a packager has reviewed the changes: "-1" means
    this has not happened, or there are issues with the new dependency; "+1"
    means it's been reviewed, and the change is approved.
7.  Update the `openstack-tripleo-ui-deps` ([GitHub][deps]) package.  Currently,
    this is done by submitting a pull request on GitHub.  There are plans in
    place to move the workflow for this repository to the gerrit system.
8.  Update the `openstack-tripleo-ui` ([GitHub][rpm]) package so that it points
    to the new version of `openstack-tripleo-ui-deps`.  This is done by
    submitting a patch via gerrit.

[tarballs]: http://tarballs.openstack.org/tripleo-ui/
[deps]: https://github.com/rdo-common/openstack-tripleo-ui-deps
[rpm]: https://github.com/rdo-packages/tripleo-ui-distgit/tree/rpm-master
[diagram]: https://www.rdoproject.org/images/documentation/rdo-full-workflow-high-level-no-buildlogs.png
[rdo]: https://www.rdoproject.org
