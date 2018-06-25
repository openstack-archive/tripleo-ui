/**
 * Copyright 2018 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { connect } from 'react-redux';
import { defineMessages, FormattedMessage } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';

import StackResourcesTable from './StackResourcesTable';
import StacksActions from '../../actions/StacksActions';

const messages = defineMessages({
  title: {
    id: 'StackResources.title',
    defaultMessage: 'Deployment Resources'
  },
  resourcesTableDescription: {
    id: 'StackResources.resourcesTableDescription',
    defaultMessage:
      'Deployment phase failed, following is a list of Heat stack resources:'
  }
});

class StackResources extends Component {
  componentDidMount() {
    const { fetchResources, resourcesLoaded, isFetchingResources } = this.props;
    if (!resourcesLoaded || isFetchingResources) {
      fetchResources();
    }
  }

  render() {
    const { resourcesLoaded, resources } = this.props;
    return (
      <Fragment>
        <h3>
          <FormattedMessage {...messages.title} />
        </h3>
        <p>
          <FormattedMessage {...messages.resourcesTableDescription} />
        </p>
        <StackResourcesTable
          isFetchingResources={!resourcesLoaded}
          resources={resources.reverse()}
        />
      </Fragment>
    );
  }
}
StackResources.propTypes = {
  fetchResources: PropTypes.func.isRequired,
  isFetchingResources: PropTypes.bool.isRequired,
  resources: ImmutablePropTypes.list.isRequired,
  resourcesLoaded: PropTypes.bool.isRequired,
  stack: ImmutablePropTypes.record.isRequired
};

const mapStateToProps = state => ({
  resources: state.stacks.resources,
  resourcesLoaded: state.stacks.resourcesLoaded,
  isFetchingResources: state.stacks.isFetchingResources
});
const mapDispatchToProps = (dispatch, { stack }) => ({
  fetchResources: () =>
    dispatch(StacksActions.fetchResources(stack.stack_name, stack.id))
});

export default connect(mapStateToProps, mapDispatchToProps)(StackResources);
