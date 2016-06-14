import * as _ from 'lodash';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Formsy from 'formsy-react';

import { getRegisteredNodes, getNodesOperationInProgress } from '../../selectors/nodes';
import FormErrorList from '../ui/forms/FormErrorList';
import NodesActions from '../../actions/NodesActions';
import NodesTable from './NodesTable';

class RegisteredNodesTabPane extends React.Component {
  constructor() {
    super();
    this.state = {
      canSubmit: false
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
        <button className="btn btn-primary"
                type="submit"
                disabled={!this.state.canSubmit || this.props.nodesOperationInProgress}>
          Introspect Nodes
        </button>
      </div>
    );
  }

  handleSubmit(formData, resetForm, invalidateForm) {
    this.disableButton();
    const nodeIds = _.keys(_.pickBy(formData, value => !!value));
    this.props.introspectNodes(nodeIds);
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
        </Formsy.Form>
        {this.props.children}
      </div>
    );
  }
}
RegisteredNodesTabPane.propTypes = {
  children: React.PropTypes.node,
  formErrors: ImmutablePropTypes.list,
  formFieldErrors: ImmutablePropTypes.map,
  introspectNodes: React.PropTypes.func.isRequired,
  isFetchingNodes: React.PropTypes.bool.isRequired,
  nodesInProgress: ImmutablePropTypes.set,
  nodesOperationInProgress: React.PropTypes.bool.isRequired,
  registeredNodes: ImmutablePropTypes.map,
  roles: ImmutablePropTypes.map
};
RegisteredNodesTabPane.defaultProps = {
  formErrors: List(),
  formFieldErrors: Map()
};

function mapStateToProps(state) {
  return {
    roles: state.roles.get('roles'),
    registeredNodes: getRegisteredNodes(state),
    nodesInProgress: state.nodes.get('nodesInProgress'),
    nodesOperationInProgress: getNodesOperationInProgress(state),
    isFetchingNodes: state.nodes.get('isFetching')
  };
}

function mapDispatchToProps(dispatch) {
  return {
    introspectNodes: nodeIds => dispatch(NodesActions.startNodesIntrospection(nodeIds))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisteredNodesTabPane);
