import * as _ from 'lodash';
import { connect } from 'react-redux';
import Formsy from 'formsy-react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import React from 'react';
import { List, Map } from 'immutable';

import { getIntrospectedNodes,
         getUnassignedIntrospectedNodes,
         getAssignedNodes } from '../../selectors/nodes';
import FormErrorList from '../ui/forms/FormErrorList';
import NodesActions from '../../actions/NodesActions';
import NodesTable from '../nodes/NodesTable';

export default class NodesAssignment extends React.Component {
  constructor() {
    super();
    this.state = {
      canSubmit: false
    };
  }

  componentDidMount() {
    this.props.fetchNodes();
  }

  componentDidUpdate() {
    this.invalidateForm(this.props.formFieldErrors.toJS());
  }

  canSubmit() {
    if(_.includes(_.values(this.refs.nodesAssignmentForm.getCurrentValues()), true)) {
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
    this.refs.nodesAssignmentForm.updateInputsWithError(formFieldErrors);
  }

  getTableActions() {
    return (
      <div className="btn-group">
        <button className="btn btn-primary"
                type="submit"
                disabled={!this.state.canSubmit || this.props.nodesOperationInProgress}>
          Assign/Unassign Selected Nodes
        </button>
      </div>
    );
  }

  handleSubmit(formData, resetForm, invalidateForm) {
    // const data = this._convertFormData(formData);
    // const formFields = Object.keys(this.refs.nodesAssignmentForm.inputs);
    this.disableButton();
    resetForm();
    // this.props.updateEnvironmentConfiguration(
    //   this.props.currentPlanName,
    //   data,
    //   formFields,
    //   this.props.parentPath
    // );
  }

  render() {
    const { roleName } = this.props.params;
    const role = this.props.roles.get(roleName);
    const nodesToAssign = this.props.unassignedIntrospectedNodes
                            .merge(getAssignedNodes(this.props.introspectedNodes, roleName));

    return (
      <div>
        <div className="modal modal-routed in" role="dialog">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <Formsy.Form ref="nodesAssignmentForm"
                           role="form"
                           className="form"
                           onSubmit={this.handleSubmit.bind(this)}
                           onValid={this.canSubmit.bind(this)}
                           onInvalid={this.disableButton.bind(this)}>
                <div className="modal-header">
                  <Link to="/deployment-plan"
                        type="button"
                        className="close">
                    <span aria-hidden="true" className="pficon pficon-close"/>
                  </Link>
                  <h4 className="modal-title">
                    Assign Nodes to {role ? role.title : roleName} Role
                  </h4>
                </div>

                <div className="modal-body">
                  <FormErrorList errors={this.props.formErrors.toJS()}/>
                  <NodesTable nodes={nodesToAssign}
                              roles={this.props.roles}
                              isFetchingNodes={this.props.isFetchingNodes}
                              dataOperationInProgress={this.props.nodesOperationInProgress}
                              tableActions={this.getTableActions.bind(this)}/>
                </div>

                <div className="modal-footer">
                  <Link to="/deployment-plan" type="button" className="btn btn-default" >
                    Done
                  </Link>
                </div>
              </Formsy.Form>
            </div>
          </div>
        </div>
        <div className="modal-backdrop in"></div>
      </div>
    );
  }
}
NodesAssignment.propTypes = {
  fetchNodes: React.PropTypes.func,
  formErrors: ImmutablePropTypes.list.isRequired,
  formFieldErrors: ImmutablePropTypes.map.isRequired,
  introspectedNodes: ImmutablePropTypes.list,
  isFetchingNodes: React.PropTypes.bool,
  nodesOperationInProgress: React.PropTypes.bool,
  params: React.PropTypes.object.isRequired,
  roles: ImmutablePropTypes.map.isRequired,
  unassignedIntrospectedNodes: ImmutablePropTypes.list
};
NodesAssignment.defaultProps = {
  formErrors: List(),
  formFieldErrors: Map()
};

function mapStateToProps(state) {
  return {
    introspectedNodes: getIntrospectedNodes(state),
    isFetchingNodes: state.nodes.get('isFetching'),
    nodesOperationInProgress: state.nodes.get('dataOperationInProgress'),
    roles: state.roles.get('roles'),
    unassignedIntrospectedNodes: getUnassignedIntrospectedNodes(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchNodes: () => dispatch(NodesActions.fetchNodes())
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NodesAssignment);
