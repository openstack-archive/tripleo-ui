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

import { getFlavorProfiles } from '../../../selectors/flavors';
import { CloseModalXButton, Modal } from '../../ui/Modals';
import { fetchFlavors } from '../../../actions/FlavorsActions';
import TagNodesForm from './TagNodesForm';

const messages = defineMessages({
  title: {
    id: 'TagNodesModal.title',
    defaultMessage: 'Tag Nodes into Profiles'
  }
});

class TagNodesModal extends React.Component {
  componentDidMount() {
    this.props.fetchFlavors();
  }

  render() {
    const { show, onCancel, onProfileSelected, profiles } = this.props;
    return (
      <Modal show={show} onHide={onCancel}>
        <ModalHeader>
          <CloseModalXButton />
          <ModalTitle>
            <span className="fa fa-tag" />{' '}
            <FormattedMessage {...messages.title} />
          </ModalTitle>
        </ModalHeader>
        <TagNodesForm
          onCancel={onCancel}
          onSubmit={onProfileSelected}
          profiles={profiles.toArray()}
        />
      </Modal>
    );
  }
}
TagNodesModal.propTypes = {
  fetchFlavors: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onProfileSelected: PropTypes.func.isRequired,
  profiles: ImmutablePropTypes.map.isRequired,
  show: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
  profiles: getFlavorProfiles(state)
});

export default connect(mapStateToProps, { fetchFlavors })(TagNodesModal);
