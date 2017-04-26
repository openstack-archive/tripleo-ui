import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import React, { PropTypes } from 'react';
import { Form, reduxForm } from 'redux-form';
import { pickBy } from 'lodash';

import NodesActions from '../../../actions/NodesActions';
import { nodesInProgress } from '../../../selectors/nodes';

const messages = defineMessages({
  selectNodes: {
    id: 'NodesListForm.selectNodesValidationMessage',
    defaultMessage: 'Please select Nodes first'
  },
  operationInProgress: {
    id: 'NodesListForm.operationInProgressValidationMessage',
    defaultMessage: 'There is an operation in progress on some of the selected Nodes'
  }
});

class NodesListForm extends React.Component {
  handleFormSubmit(formData) {
    const nodeIds = Object.keys(pickBy(formData.values, value => !!value));

    switch (formData.submitAction) {
    case ('introspect'):
      this.props.introspectNodes(nodeIds);
      break;
    case ('provide'):
      this.props.provideNodes(nodeIds);
      break;
    case ('tag'):
      this.props.tagNodes(nodeIds, formData.tag);
      break;
    case ('delete'):
      this.props.deleteNodes(nodeIds);
      break;
    default:
      break;
    }

    this.props.reset();
  }

  render() {
    return (
      <Form onSubmit={this.props.handleSubmit(this.handleFormSubmit.bind(this))}>
        {this.props.children}
      </Form>
    );
  }
}
NodesListForm.propTypes = {
  children: PropTypes.node,
  deleteNodes: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  intl: PropTypes.object,
  introspectNodes: PropTypes.func.isRequired,
  provideNodes: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  tagNodes: PropTypes.func.isRequired
};

const validate = (formData, props) => {
  const errors = {};
  const nodeIds = Object.keys(pickBy(formData.values, value => !!value));
  const selectedInProgress = props.nodesInProgress.intersect(nodeIds).size;
  if (nodeIds.length === 0) {
    errors._error = props.intl.formatMessage(messages.selectNodes);
  } else if (selectedInProgress > 0) {
    errors._error = props.intl.formatMessage(messages.operationInProgress);
  }
  return errors;
};

const form = reduxForm({
  form: 'nodesListForm',
  validate
});

const mapStateToProps = state => ({
  nodesInProgress: nodesInProgress(state)
});

const mapDispatchToProps = dispatch => ({
  deleteNodes: nodeIds => dispatch(NodesActions.deleteNodes(nodeIds)),
  introspectNodes: nodeIds => dispatch(NodesActions.startNodesIntrospection(nodeIds)),
  provideNodes: nodeIds => dispatch(NodesActions.startProvideNodes(nodeIds)),
  tagNodes: (nodeIds, tag) => dispatch(NodesActions.tagNodes(nodeIds, tag))
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(form(NodesListForm)));
