import * as _ from 'lodash';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Formsy from 'formsy-react';

import { getRegisteredNodes, getNodesOperationInProgress } from '../../selectors/nodes';
import { getRoles } from '../../selectors/roles';
import ConfirmationModal from '../ui/ConfirmationModal';
import FormErrorList from '../ui/forms/FormErrorList';
import NodesActions from '../../actions/NodesActions';
import NodesTable from './NodesTable';

class RegisteredNodesTabPane extends React.Component {
  constructor() {
    super();
    this.state = {
      canSubmit: false,
      showDeleteModal: false,
      submitType: 'introspect'
    };
  }

  componentDidUpdate() {
    this.invalidateForm(this.props.formFieldErrors.toJS());
  }

  canSubmit() {
    if(_.includes(_.values(this.refs.registeredNodesTableForm.getCurrentValues()), true)) {
      this.enableButton();
    } else {
      this.disableButton();
    }
  }

  enableButton() {
    this.setState({ canSubmit: true });
  }

  disableButton() {
    this.setState({ canSubmit: false });
  }

  invalidateForm(formFieldErrors) {
    this.refs.registeredNodesTableForm.updateInputsWithError(formFieldErrors);
  }

  getTableActions() {
    return (
      <div className="btn-group">
        <button className="btn btn-default"
                type="button"
                name="introspect"
                onClick={this.multipleSubmit.bind(this)}
                disabled={!this.state.canSubmit || this.props.nodesOperationInProgress}>
          Introspect Nodes
        </button>
        <button className="btn btn-default"
                type="button"
                name="provide"
                onClick={this.multipleSubmit.bind(this)}
                disabled={!this.state.canSubmit || this.props.nodesOperationInProgress}>
          Provide Nodes
        </button>
        <button className="btn btn-danger"
                type="button"
                name="delete"
                onClick={() => this.setState({ showDeleteModal: true })}
                disabled={!this.state.canSubmit || this.props.nodesOperationInProgress}>
          Delete Nodes
        </button>
      </div>
    );
  }

  multipleSubmit(e) {
    this.setState({
      submitType: e.target.name
    }, this.refs.registeredNodesTableForm.submit);
  }

  handleSubmit(formData, resetForm, invalidateForm) {
    this.disableButton();
    const nodeIds = _.keys(_.pickBy(formData, value => !!value));

    switch (this.state.submitType) {
    case ('introspect'):
      this.props.introspectNodes(nodeIds);
      break;
    case ('provide'):
      this.props.provideNodes(nodeIds);
      break;
    case ('delete'):
      this.setState({ showDeleteModal: false });
      this.props.deleteNodes(nodeIds);
      break;
    default:
      break;
    }

    resetForm();
  }

  render() {
    return (
      <div>
        <Formsy.Form ref="registeredNodesTableForm"
                     role="form"
                     className="form"
                     onSubmit={this.handleSubmit.bind(this)}
                     onValid={this.canSubmit.bind(this)}
                     onInvalid={this.disableButton.bind(this)}>
          <FormErrorList errors={this.props.formErrors.toJS()}/>
          <NodesTable nodes={this.props.registeredNodes}
                      roles={this.props.roles}
                      dataOperationInProgress={this.props.nodesOperationInProgress}
                      nodesInProgress={this.props.nodesInProgress}
                      isFetchingNodes={this.props.isFetchingNodes}
                      tableActions={this.getTableActions.bind(this)}/>
          <ConfirmationModal show={this.state.showDeleteModal}
                             title="Delete Nodes"
                             question="Are you sure you want to delete the selected nodes?"
                             iconClass="pficon pficon-delete"
                             confirmActionName="delete"
                             onConfirm={this.multipleSubmit.bind(this)}
                             onCancel={() => this.setState({ showDeleteModal: false })}/>
        </Formsy.Form>
        {this.props.children}
      </div>
    );
  }
}
RegisteredNodesTabPane.propTypes = {
  children: React.PropTypes.node,
  deleteNodes: React.PropTypes.func.isRequired,
  formErrors: ImmutablePropTypes.list,
  formFieldErrors: ImmutablePropTypes.map,
  introspectNodes: React.PropTypes.func.isRequired,
  isFetchingNodes: React.PropTypes.bool.isRequired,
  nodesInProgress: ImmutablePropTypes.set,
  nodesOperationInProgress: React.PropTypes.bool.isRequired,
  provideNodes: React.PropTypes.func.isRequired,
  registeredNodes: ImmutablePropTypes.map,
  roles: ImmutablePropTypes.map
};
RegisteredNodesTabPane.defaultProps = {
  formErrors: List(),
  formFieldErrors: Map()
};

function mapStateToProps(state) {
  return {
    roles: getRoles(state),
    registeredNodes: getRegisteredNodes(state),
    nodesInProgress: state.nodes.get('nodesInProgress'),
    nodesOperationInProgress: getNodesOperationInProgress(state),
    isFetchingNodes: state.nodes.get('isFetching')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    deleteNodes: nodeIds => dispatch(NodesActions.deleteNodes(nodeIds)),
    introspectNodes: nodeIds => dispatch(NodesActions.startNodesIntrospection(nodeIds)),
    provideNodes: nodeIds => dispatch(NodesActions.startProvideNodes(nodeIds))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisteredNodesTabPane);
