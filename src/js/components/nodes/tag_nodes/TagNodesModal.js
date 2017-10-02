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
import PropTypes from 'prop-types';
import React from 'react';

import { getAvailableNodeProfiles } from '../../../selectors/nodes';
import { getRoles } from '../../../selectors/roles';
import Modal from '../../ui/Modal';
import TagNodesForm from './TagNodesForm';

const messages = defineMessages({
  title: {
    id: 'TagNodesModal.title',
    defaultMessage: 'Tag Nodes into Profiles'
  }
});

class TagNodesModal extends React.Component {
  render() {
    const {
      show,
      onCancel,
      onProfileSelected,
      availableProfiles,
      roles
    } = this.props;
    return (
      <Modal dialogClasses="modal-md" show={show}>
        <div className="modal-header">
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={onCancel}
          >
            <span aria-hidden="true" className="pficon pficon-close" />
          </button>
          <h4 className="modal-title">
            <span className="fa fa-tag" />
            {' '}
            <FormattedMessage {...messages.title} />
          </h4>
        </div>
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
  onCancel: PropTypes.func.isRequired,
  onProfileSelected: PropTypes.func.isRequired,
  roles: ImmutablePropTypes.map.isRequired,
  show: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  availableProfiles: getAvailableNodeProfiles(state),
  roles: getRoles(state)
});

export default connect(mapStateToProps)(TagNodesModal);
