/**
 * Copyright 2017 Red Hat Inc.
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
import { ModalHeader, ModalTitle } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';

import { getAvailableNodeProfiles } from '../../../selectors/nodes';
import { getCurrentPlan } from '../../../selectors/plans';
import { getRoles } from '../../../selectors/roles';
import { CloseModalXButton, Modal } from '../../ui/Modals';
import RolesActions from '../../../actions/RolesActions';
import TagNodesForm from './TagNodesForm';

const messages = defineMessages({
  title: {
    id: 'TagNodesModal.title',
    defaultMessage: 'Tag Nodes into Profiles'
  }
});

class TagNodesModal extends React.Component {
  componentDidMount() {
    const { currentPlan, fetchRoles } = this.props;
    currentPlan && fetchRoles(currentPlan.name);
  }

  render() {
    const {
      show,
      onCancel,
      onProfileSelected,
      availableProfiles,
      roles
    } = this.props;
    return (
      <Modal show={show} onHide={onCancel}>
        <ModalHeader>
          <CloseModalXButton />
          <ModalTitle>
            <span className="fa fa-tag" />
            {' '}
            <FormattedMessage {...messages.title} />
          </ModalTitle>
        </ModalHeader>
        <TagNodesForm
          onCancel={onCancel}
          onSubmit={onProfileSelected}
          profiles={availableProfiles.toArray()}
          roles={roles.toList()}
        />
      </Modal>
    );
  }
}
TagNodesModal.propTypes = {
  availableProfiles: ImmutablePropTypes.list.isRequired,
  currentPlan: ImmutablePropTypes.record,
  fetchRoles: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onProfileSelected: PropTypes.func.isRequired,
  roles: ImmutablePropTypes.map.isRequired,
  show: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  availableProfiles: getAvailableNodeProfiles(state),
  currentPlan: getCurrentPlan(state),
  roles: getRoles(state)
});

const mapDispatchToProps = dispatch => ({
  fetchRoles: planName => dispatch(RolesActions.fetchRoles(planName))
});

export default connect(mapStateToProps, mapDispatchToProps)(TagNodesModal);
