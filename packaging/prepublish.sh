#!/bin/env bash

# Create a tarball of node_modules so that it's included in the bundle created
# by "npm pack".

rm -rf tripleo-ui-*\.tar.gz
npm prune
tar czf node_modules.tar.gz node_modules
