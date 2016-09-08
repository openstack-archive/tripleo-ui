import * as _ from 'lodash';
import { connect } from 'react-redux';
import Formsy from 'formsy-react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import React from 'react';
import { List, Map } from 'immutable';

import { getAvailableNodes,
         getUnassignedAvailableNodes,
         getNodesOperationInProgress,
         getAssignedNodes } from '../../selectors/nodes';
import FormErrorList from '../ui/forms/FormErrorList';
import Modal from '../ui/Modal';
import NodesActions from '../../actions/NodesActions';
import NodesTable from '../nodes/NodesTable';

class NodesAssignment extends React.Component {
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
    this.disableButton();
    const nodesToUpdate = _.pickBy(formData, value => !!value);
    _.keys(nodesToUpdate).map(nodeId => {
      const node = this.props.availableNodes.get(nodeId);
      let value;
      if(this.props.unassignedAvailableNodes.includes(node)) {
        value = node.getIn(['properties', 'capabilities']) +
                `,profile:${this.props.params.roleIdentifier}`;
      } else {
        value = node.getIn(['properties', 'capabilities']).replace(/,profile:(\w+)/, '');
      }
      const nodePatch = {
        uuid: nodeId,
        patches: [{
          op: 'replace',
          path: '/properties/capabilities',
          value: value
        }]
      };
      this.props.updateNode(nodePatch);
    });
    resetForm();
  }

  render() {
    const { roleIdentifier } = this.props.params;
    const role = this.props.roles.get(roleIdentifier);
    const nodesToAssign = this.props.unassignedAvailableNodes
                            .merge(getAssignedNodes(this.props.availableNodes, role.identifier))
                            .sortBy(node => node.get('uuid'));

    return (
      <Modal dialogClasses="modal-xl">
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
              Assign Nodes to {role ? role.title : roleIdentifier} Role
            </h4>
          </div>

          <div className="modal-body">
            <FormErrorList errors={this.props.formErrors.toJS()}/>
            <NodesTable nodes={nodesToAssign}
                        roles={this.props.roles}
                        isFetchingNodes={this.props.isFetchingNodes}
                        dataOperationInProgress={this.props.nodesOperationInProgress}
                        nodesInProgress={this.props.nodesInProgress}
                        tableActions={this.getTableActions.bind(this)}/>
          </div>

          <div className="modal-footer">
            <Link to="/deployment-plan" type="button" className="btn btn-default" >
              Done
            </Link>
          </div>
        </Formsy.Form>
      </Modal>
    );
  }
}
NodesAssignment.propTypes = {
  availableNodes: ImmutablePropTypes.map,
  fetchNodes: React.PropTypes.func.isRequired,
  formErrors: ImmutablePropTypes.list.isRequired,
  formFieldErrors: ImmutablePropTypes.map.isRequired,
  isFetchingNodes: React.PropTypes.bool,
  nodesInProgress: ImmutablePropTypes.set,
  nodesOperationInProgress: React.PropTypes.bool,
  params: React.PropTypes.object.isRequired,
  roles: ImmutablePropTypes.map.isRequired,
  unassignedAvailableNodes: ImmutablePropTypes.map,
  updateNode: React.PropTypes.func.isRequired
};
NodesAssignment.defaultProps = {
  formErrors: List(),
  formFieldErrors: Map()
};

function mapStateToProps(state) {
  return {
    availableNodes: getAvailableNodes(state),
    isFetchingNodes: state.nodes.get('isFetching'),
    nodesInProgress: state.nodes.get('nodesInProgress'),
    nodesOperationInProgress: getNodesOperationInProgress(state),
    roles: state.roles.get('roles'),
    unassignedAvailableNodes: getUnassignedAvailableNodes(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchNodes: () => dispatch(NodesActions.fetchNodes()),
    updateNode: (node) => dispatch(NodesActions.updateNode(node))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NodesAssignment);
