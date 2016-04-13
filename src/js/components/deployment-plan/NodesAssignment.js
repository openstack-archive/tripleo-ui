import { connect } from 'react-redux';
import Formsy from 'formsy-react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import React from 'react';

import { getIntrospectedNodes, getUnassignedIntrospectedNodes } from '../../selectors/nodes';
// import FormErrorList from '../ui/forms/FormErrorList';
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

  enableButton() {
    this.setState({ canSubmit: true });
  }

  disableButton() {
    this.setState({ canSubmit: false });
  }

  invalidateForm(formFieldErrors) {
    this.refs.nodesAssignmentForm.updateInputsWithError(formFieldErrors);
  }

  handleSubmit(formData, resetForm, invalidateForm) {
    // const data = this._convertFormData(formData);
    // const formFields = Object.keys(this.refs.nodesAssignmentForm.inputs);
    this.disableButton();
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

    return (
      <div>
        <div className="modal modal-routed in" role="dialog">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <Formsy.Form ref="nodesAssignmentForm"
                           role="form"
                           className="form"
                           onSubmit={this.handleSubmit.bind(this)}
                           onValid={this.enableButton.bind(this)}
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
                  <NodesTable nodes={this.props.introspectedNodes}
                              roles={this.props.roles}
                              isFetchingNodes={this.props.isFetchingNodes}
                              dataOperationInProgress={this.props.nodesOperationInProgress}/>
                </div>

                <div className="modal-footer">
                  <button type="submit" disabled={!this.state.canSubmit}
                          className="btn btn-primary">
                    Save Changes
                  </button>
                  <Link to="/deployment-plan" type="button" className="btn btn-default" >
                    Cancel
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

function mapStateToProps(state) {
  return {
    formErrors: state.environmentConfiguration.getIn(['form', 'formErrors']),
    formFieldErrors: state.environmentConfiguration.getIn(['form', 'formFieldErrors']),
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
