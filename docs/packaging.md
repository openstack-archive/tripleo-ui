# TripleO UI packaging

## TL;DR

* We need people from the RDO team to approve all changes
* New packages are built on every upstream merge commit
* Use npm shrinkwrap when updating dependencies in `package.json`

## Upstream

For upstream releases, we only provide a source tarball.  This is released via
the `project-config` machinery just like other TripleO projects.  The tarball is
produced by running `npm pack` in the root of the project, and excludes the
`node_modules` directory.  The tarballs are available [here][1].

## Downstream

### RDO

The product of RDO packaging is a set of two RPMs:

* `openstack-tripleo-ui-deps` [GitHub][1]
* `openstack-tripleo-ui` [GitHub][2]

And of course, the second one depends on the first one.  The `-deps` package
contains the contents of the `node_modules` directory.

An RPM is created from a `.spec` file.  These files can be access via the above
GitHub links.  Any changes to the files are subject to review by the RDO team.
This can be a lengthy process because software licenses need to be reviewed.

RDO builds packages in two different streams: trunk and stable.  Study the
following graphic to understand how code flows through the pipeline:

## What to do when dependencies change

This applies both to adding *new* dependencies, and upgrading *existing* ones.

1.  Make the required changes in `package.json`
2.  `$ rm -rf node_modules`
3.  `$ npm cache clean`
4.  `$ npm install`
5.  `$ npm shrinkwrap`
6.  Commit those changes along with your dependency changes in `tripleo-ui`
7.  Update the `openstack-tripleo-ui-deps` ([GitHub][2]) package
8.  Update the `openstack-tripleo-ui` ([GitHub][3]) package so that it points
    to the new version of `openstack-tripleo-ui-deps`

[1]: http://tarballs.openstack.org/tripleo-ui/
[2]: https://github.com/rdo-common/openstack-tripleo-ui-deps
[3]: https://github.com/rdo-packages/tripleo-ui-distgit/tree/rpm-master
