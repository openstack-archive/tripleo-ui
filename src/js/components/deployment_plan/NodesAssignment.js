import * as _ from 'lodash';
import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import Formsy from 'formsy-react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Link } from 'react-router';
import React from 'react';
import { List, Map } from 'immutable';

import { getAvailableNodes,
         getUnassignedAvailableNodes,
         getNodesOperationInProgress,
         getAssignedNodes } from '../../selectors/nodes';
import { getRoles } from '../../selectors/roles';
import { getCurrentPlan } from '../../selectors/plans';
import FormErrorList from '../ui/forms/FormErrorList';
import Modal from '../ui/Modal';
import NodesActions from '../../actions/NodesActions';
import NodesTable from '../nodes/NodesTable';

const messages = defineMessages({
  assignUnassignNodes: {
    id: 'NodesAssignment.assignUnassignNodes',
    defaultMessage: 'Assign/Unassign Selected Nodes'
  },
  assignNodesToRole: {
    id: 'NodesAssignment.assignNodesToRole',
    defaultMessage: 'Assign Nodes to {roleName} Role'
  },
  done: {
    id: 'NodesAssignment.done',
    defaultMessage: 'Done'
  }
});

class NodesAssignment extends React.Component {

  componentDidMount() {
    this.props.fetchNodes();
  }

  componentDidUpdate() {
    this.invalidateForm(this.props.formFieldErrors.toJS());
  }

  invalidateForm(formFieldErrors) {
    this.refs.nodesAssignmentForm.updateInputsWithError(formFieldErrors);
  }

  getTableActions() {
    return (
      <div className="btn-group">
        <button className="btn btn-primary"
                type="submit"
                disabled={this.props.nodesOperationInProgress}>
          <FormattedMessage {...messages.assignUnassignNodes}/>
        </button>
      </div>
    );
  }

  handleSubmit(formData, resetForm, invalidateForm) {
    const nodesToUpdateIds = _.keys(_.pickBy(formData, value => !!value));

    let tagNodeIds = [];
    let untagNodeIds = [];

    _.each(nodesToUpdateIds, (nodeId) => {
      if(this.props.unassignedAvailableNodes.keySeq().includes(nodeId)) {
        tagNodeIds.push(nodeId);
      } else {
        untagNodeIds.push(nodeId);
      }
    });

    const role = this.props.params.roleIdentifier;
    const planName = this.props.currentPlan.name;
    this.props.assignNodes(tagNodeIds, untagNodeIds, role, planName);
    resetForm();
  }

  render() {
    const { roleIdentifier } = this.props.params;
    const role = this.props.roles.get(roleIdentifier);
    const roleName = role ? role.title : roleIdentifier;
    const nodesToAssign = this.props.unassignedAvailableNodes
                            .merge(getAssignedNodes(this.props.availableNodes, roleIdentifier))
                            .sortBy(node => node.get('uuid'));

    return (
      <Modal dialogClasses="modal-xl">
        <Formsy.Form ref="nodesAssignmentForm"
                     role="form"
                     className="form"
                     onSubmit={this.handleSubmit.bind(this)}>
          <div className="modal-header">
            <Link to="/deployment-plan"
                  type="button"
                  className="close">
              <span aria-hidden="true" className="pficon pficon-close"/>
            </Link>
            <h4 className="modal-title">
              <FormattedMessage {...messages.assignNodesToRole} values={{ roleName: roleName }}/>
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
              <FormattedMessage {...messages.done}/>
            </Link>
          </div>
        </Formsy.Form>
      </Modal>
    );
  }
}
NodesAssignment.propTypes = {
  assignNodes: React.PropTypes.func.isRequired,
  availableNodes: ImmutablePropTypes.map,
  currentPlan: ImmutablePropTypes.record,
  fetchNodes: React.PropTypes.func.isRequired,
  formErrors: ImmutablePropTypes.list.isRequired,
  formFieldErrors: ImmutablePropTypes.map.isRequired,
  isFetchingNodes: React.PropTypes.bool,
  nodesInProgress: ImmutablePropTypes.set,
  nodesOperationInProgress: React.PropTypes.bool,
  params: React.PropTypes.object.isRequired,
  roles: ImmutablePropTypes.map.isRequired,
  unassignedAvailableNodes: ImmutablePropTypes.map
};
NodesAssignment.defaultProps = {
  formErrors: List(),
  formFieldErrors: Map()
};

function mapStateToProps(state) {
  return {
    availableNodes: getAvailableNodes(state),
    currentPlan: getCurrentPlan(state),
    isFetchingNodes: state.nodes.get('isFetching'),
    nodesInProgress: state.nodes.get('nodesInProgress'),
    nodesOperationInProgress: getNodesOperationInProgress(state),
    roles: getRoles(state),
    unassignedAvailableNodes: getUnassignedAvailableNodes(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchNodes: () => dispatch(NodesActions.fetchNodes()),
    assignNodes: (tagNodeIds, untagNodeIds, role, planName) =>
        dispatch(NodesActions.startNodesAssignment(tagNodeIds, untagNodeIds, role, planName)
    )
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(NodesAssignment));
