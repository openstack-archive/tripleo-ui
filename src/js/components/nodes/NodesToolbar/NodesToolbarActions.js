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

import { Button, FormGroup, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import React from 'react';
import PropTypes from 'prop-types';
import { change, submit, isInvalid } from 'redux-form';

import ConfirmationModal from '../../ui/ConfirmationModal';
import DropdownKebab from '../../ui/dropdown/DropdownKebab';
import TagNodesModal from '../tag_nodes/TagNodesModal';

const messages = defineMessages({
  deleteNodesModalTitle: {
    id: 'NodesToolbarActions.deleteNodesModalTitle',
    defaultMessage: 'Delete Nodes'
  },
  deleteNodesModalMessage: {
    id: 'NodesToolbarActions.deleteNodesModalMessage',
    defaultMessage: 'Are you sure you want to delete the selected nodes?'
  },
  disabledButtonsWarning: {
    id: 'NodesToolbarActions.disabledButtonsWarning',
    defaultMessage: 'You need to select Nodes first, or there is an operation already in ' +
      'progress on some of the selected Nodes.'
  },
  introspectNodes: {
    id: 'NodesToolbarActions.introspectNodes',
    defaultMessage: 'Introspect Nodes'
  },
  tagNodes: {
    id: 'NodesToolbarActions.tagNodes',
    defaultMessage: 'Tag Nodes'
  },
  provideNodes: {
    id: 'NodesToolbarActions.provideNodes',
    defaultMessage: 'Provide Nodes',
    description: '"Providing" the nodes changes the provisioning state to "available" so that ' +
      'they can be used in a deployment.'
  },
  manageNodes: {
    id: 'NodesToolbarActions.manageNodes',
    defaultMessage: 'Manage Nodes',
    description: '"Managing" the nodes changes the provisioning state to "manageable" so that ' +
      'they can be introspected.'
  },
  deleteNodes: {
    id: 'NodesToolbarActions.deleteNodes',
    defaultMessage: 'Delete Nodes'
  }
});

class NodesToolbarActions extends React.Component {
  constructor() {
    super();
    this.state = {
      showDeleteModal: false,
      showTagNodesModal: false
    };
  }

  submitForm(action) {
    this.props.setSubmitAction(action);
    // TODO(jtomasek): hacky way to submit with updated values
    // https://github.com/erikras/redux-form/issues/2818
    setTimeout(() => this.props.submitForm());
  }

  deleteNodes(action) {
    this.submitForm(action);
    this.setState({ showDeleteModal: false });
  }

  tagNodes(tag) {
    this.props.setTag(tag);
    this.submitForm('tag');
    this.setState({ showTagNodesModal: false });
  }

  render() {
    const { disabled, intl } = this.props;
    return (
      // TODO(jtomasek): include proper error message from the form accessed via getFormSyncErrors
      // selector once the 'error' is available via selector
      // https://github.com/erikras/redux-form/issues/2872
      (
        <FormGroup
          title={
            disabled ? intl.formatMessage(messages.disabledButtonsWarning) : ''
          }
        >
          <Button
            id="NodesToolbarActions__introspectNodesAction"
            disabled={this.props.disabled}
            onClick={this.submitForm.bind(this, 'introspect')}
          >
            <FormattedMessage {...messages.introspectNodes} />
          </Button>
          <Button
            id="NodesToolbarActions__provideNodesAction"
            disabled={this.props.disabled}
            onClick={this.submitForm.bind(this, 'provide')}
          >
            <FormattedMessage {...messages.provideNodes} />
          </Button>
          <DropdownKebab id="NodesToolbarActions__nodesActionsKebab" pullRight>
            <MenuItem
              id="NodesToolbarActions__manageNodesAction"
              disabled={this.props.disabled}
              onClick={this.submitForm.bind(this, 'manage')}
            >
              <FormattedMessage {...messages.manageNodes} />
            </MenuItem>
            <MenuItem
              id="NodesToolbarActions__tagNodesAction"
              disabled={this.props.disabled}
              onClick={() => this.setState({ showTagNodesModal: true })}
            >
              <FormattedMessage {...messages.tagNodes} />
            </MenuItem>
            <MenuItem
              id="NodesToolbarActions__deleteNodesAction"
              className="bg-danger"
              disabled={this.props.disabled}
              onClick={() => this.setState({ showDeleteModal: true })}
            >
              <FormattedMessage {...messages.deleteNodes} />
            </MenuItem>
          </DropdownKebab>
          <ConfirmationModal
            show={this.state.showDeleteModal}
            title={this.props.intl.formatMessage(
              messages.deleteNodesModalTitle
            )}
            question={this.props.intl.formatMessage(
              messages.deleteNodesModalMessage
            )}
            iconClass="pficon pficon-delete"
            onConfirm={() => this.deleteNodes('delete')}
            onCancel={() => this.setState({ showDeleteModal: false })}
          />
          <TagNodesModal
            onProfileSelected={this.tagNodes.bind(this)}
            onCancel={() => this.setState({ showTagNodesModal: false })}
            show={this.state.showTagNodesModal}
          />
        </FormGroup>
      )
    );
  }
}
NodesToolbarActions.propTypes = {
  disabled: PropTypes.bool.isRequired,
  intl: PropTypes.object,
  setSubmitAction: PropTypes.func.isRequired,
  setTag: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  disabled: isInvalid('nodesListForm')(state)
});

const mapDispatchToProps = dispatch => ({
  setSubmitAction: action =>
    dispatch(change('nodesListForm', 'submitAction', action)),
  setTag: tag => dispatch(change('nodesListForm', 'tag', tag)),
  submitForm: () => dispatch(submit('nodesListForm'))
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(NodesToolbarActions)
);
