import * as _ from 'lodash';
import { connect } from 'react-redux';
import { List, Map } from 'immutable';
import Formsy from 'formsy-react';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import FormErrorList from '../ui/forms/FormErrorList';
import NodesTable from './NodesTable';
import { getNodesOperationInProgress,
         getMaintenanceNodes } from '../../selectors/nodes';

class MaintenanceNodesTabPane extends React.Component {
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
    if(_.includes(_.values(this.refs.maintenanceNodesTableForm.getCurrentValues()), true)) {
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
    this.refs.maintenanceNodesTableForm.updateInputsWithError(formFieldErrors);
  }

  handleSubmit(formData, resetForm, invalidateForm) {
    // const data = this._convertFormData(formData);
    // const formFields = Object.keys(this.refs.maintenanceNodesTableForm.inputs);
    this.disableButton();
    resetForm();
  }

  render() {
    return (
      <Formsy.Form ref="maintenanceNodesTableForm"
                   role="form"
                   className="form"
                   onSubmit={this.handleSubmit.bind(this)}
                   onValid={this.canSubmit.bind(this)}
                   onInvalid={this.disableButton.bind(this)}>
        <FormErrorList errors={this.props.formErrors.toJS()}/>
        <NodesTable nodes={this.props.maintenanceNodes}
                    roles={this.props.roles}
                    nodesInProgress={this.props.nodesInProgress}
                    isFetchingNodes={this.props.isFetchingNodes}
                    dataOperationInProgress={this.props.nodesOperationInProgress}/>
      </Formsy.Form>
    );
  }
}
MaintenanceNodesTabPane.propTypes = {
  formErrors: ImmutablePropTypes.list.isRequired,
  formFieldErrors: ImmutablePropTypes.map.isRequired,
  isFetchingNodes: React.PropTypes.bool.isRequired,
  maintenanceNodes: ImmutablePropTypes.map.isRequired,
  nodesInProgress: ImmutablePropTypes.set.isRequired,
  nodesOperationInProgress: React.PropTypes.bool.isRequired,
  roles: ImmutablePropTypes.map
};
MaintenanceNodesTabPane.defaultProps = {
  formErrors: List(),
  formFieldErrors: Map()
};

function mapStateToProps(state) {
  return {
    roles: state.roles.get('roles'),
    maintenanceNodes: getMaintenanceNodes(state),
    nodesInProgress: state.nodes.get('nodesInProgress'),
    nodesOperationInProgress: getNodesOperationInProgress(state),
    isFetchingNodes: state.nodes.get('isFetching')
  };
}

export default connect(mapStateToProps)(MaintenanceNodesTabPane);
