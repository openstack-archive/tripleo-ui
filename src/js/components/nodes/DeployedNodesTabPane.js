import * as _ from 'lodash';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import Formsy from 'formsy-react';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import { getNodesOperationInProgress,
         getDeployedNodes } from '../../selectors/nodes';
import FormErrorList from '../ui/forms/FormErrorList';
import NodesTable from './NodesTable';

class DeployedNodesTabPane extends React.Component {
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
    if(_.includes(_.values(this.refs.deployedNodesTableForm.getCurrentValues()), true)) {
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
    this.refs.deployedNodesTableForm.updateInputsWithError(formFieldErrors);
  }

  handleSubmit(formData, resetForm, invalidateForm) {
    // const data = this._convertFormData(formData);
    // const formFields = Object.keys(this.refs.deployedNodesTableForm.inputs);
    this.disableButton();
    resetForm();
  }

  render() {
    return (
      <Formsy.Form ref="deployedNodesTableForm"
                   role="form"
                   className="form"
                   onSubmit={this.handleSubmit.bind(this)}
                   onValid={this.canSubmit.bind(this)}
                   onInvalid={this.disableButton.bind(this)}>
        <FormErrorList errors={this.props.formErrors.toJS()}/>
        <NodesTable nodes={this.props.deployedNodes}
                    roles={this.props.roles}
                    nodesInProgress={this.props.nodesInProgress}
                    isFetchingNodes={this.props.isFetchingNodes}
                    dataOperationInProgress={this.props.nodesOperationInProgress}/>
      </Formsy.Form>
    );
  }
}
DeployedNodesTabPane.propTypes = {
  deployedNodes: ImmutablePropTypes.map.isRequired,
  formErrors: ImmutablePropTypes.list.isRequired,
  formFieldErrors: ImmutablePropTypes.map.isRequired,
  isFetchingNodes: React.PropTypes.bool.isRequired,
  nodesInProgress: ImmutablePropTypes.set.isRequired,
  nodesOperationInProgress: React.PropTypes.bool.isRequired,
  roles: ImmutablePropTypes.map
};
DeployedNodesTabPane.defaultProps = {
  formErrors: List(),
  formFieldErrors: Map()
};

function mapStateToProps(state) {
  return {
    deployedNodes: getDeployedNodes(state),
    isFetchingNodes: state.nodes.get('isFetching'),
    nodesInProgress: state.nodes.get('nodesInProgress'),
    nodesOperationInProgress: getNodesOperationInProgress(state),
    roles: state.roles.get('roles')
  };
}

export default connect(mapStateToProps)(DeployedNodesTabPane);
