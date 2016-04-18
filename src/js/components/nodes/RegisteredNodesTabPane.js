import * as _ from 'lodash';
import { List, Map } from 'immutable';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Formsy from 'formsy-react';

import FormErrorList from '../ui/forms/FormErrorList';
import NodesTable from './NodesTable';

export default class RegisteredNodesTabPane extends React.Component {
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
    const dataOperationInProgress = this.props.nodes.get('dataOperationInProgress');
    return (
      <div className="btn-group">
        <button className="btn btn-primary"
                type="submit"
                disabled={!this.state.canSubmit || dataOperationInProgress}>
          Introspect Nodes
        </button>
      </div>
    );
  }

  handleSubmit(formData, resetForm, invalidateForm) {
    // const data = this._convertFormData(formData);
    // const formFields = Object.keys(this.refs.registeredNodesTableForm.inputs);
    this.disableButton();
    this.props.introspectNodes();
    resetForm();
    // TODO(jtomasek): use this when Introspection workflow uses provided nodes selection
    // this.props.introspectNodes(
    //   this.props.currentPlanName,
    //   data,
    //   formFields,
    //   this.props.parentPath
    // );
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
          <NodesTable nodes={this.props.nodes.get('registered')}
                      roles={this.props.roles}
                      dataOperationInProgress={this.props.nodes.get('dataOperationInProgress')}
                      isFetchingNodes={this.props.nodes.get('isFetching')}
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
  introspectNodes: React.PropTypes.func,
  nodes: ImmutablePropTypes.map,
  roles: ImmutablePropTypes.map
};
RegisteredNodesTabPane.defaultProps = {
  formErrors: List(),
  formFieldErrors: Map()
};
