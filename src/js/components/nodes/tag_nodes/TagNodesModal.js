import { defineMessages, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Modal from '../../ui/Modal';
import TagNodesForm from './TagNodesForm';

const messages = defineMessages({
  title: {
    id: 'TagNodesModal.title',
    defaultMessage: 'Tag Nodes into Profiles'
  }
});

export default class TagNodesModal extends React.Component {
  render() {
    return (
      <Modal dialogClasses="modal-md" show={this.props.show}>
        <div className="modal-header">
          <button type="button"
                  className="close"
                  aria-label="Close"
                  onClick={this.props.onCancel}>
            <span aria-hidden="true" className="pficon pficon-close"/>
          </button>
          <h4 className="modal-title">
            <span className="fa fa-tag"/> <FormattedMessage {...messages.title}/>
          </h4>
        </div>
        <TagNodesForm
          onCancel={this.props.onCancel}
          onSubmit={this.props.onProfileSelected}
          profiles={this.props.availableProfiles}/>
      </Modal>
    );
  }
}
TagNodesModal.propTypes = {
  availableProfiles: PropTypes.array.isRequired,
  onCancel: PropTypes.func.isRequired,
  onProfileSelected: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired
};
