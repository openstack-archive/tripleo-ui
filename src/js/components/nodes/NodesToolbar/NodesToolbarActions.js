import { Button, FormGroup, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React, { PropTypes } from 'react';
import { change, submit, isInvalid } from 'redux-form';

import ConfirmationModal from '../../ui/ConfirmationModal';
import DropdownKebab from '../../ui/dropdown/DropdownKebab';
import { getAvailableNodeProfiles } from '../../../selectors/nodes';
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
    defaultMessage: 'You need to select Nodes first, or there might be an operation already in ' +
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
            disabled={this.props.disabled}
            onClick={this.submitForm.bind(this, 'introspect')}
          >
            <FormattedMessage {...messages.introspectNodes} />
          </Button>
          <Button
            disabled={this.props.disabled}
            onClick={this.submitForm.bind(this, 'provide')}
          >
            <FormattedMessage {...messages.provideNodes} />
          </Button>
          <DropdownKebab id="nodesActionsKebab" pullRight>
            <MenuItem
              disabled={this.props.disabled}
              onClick={() => this.setState({ showTagNodesModal: true })}
            >
              <FormattedMessage {...messages.tagNodes} />
            </MenuItem>
            <MenuItem
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
            availableProfiles={this.props.availableProfiles.toArray()}
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
  availableProfiles: ImmutablePropTypes.list.isRequired,
  disabled: PropTypes.bool.isRequired,
  intl: PropTypes.object,
  setSubmitAction: PropTypes.func.isRequired,
  setTag: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  availableProfiles: getAvailableNodeProfiles(state),
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
