import * as _ from 'lodash';
import { List, Map } from 'immutable';
import Formsy from 'formsy-react';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import FormErrorList from '../ui/forms/FormErrorList';
import NodesTable from './NodesTable';

export default class DeployedNodesTabPane extends React.Component {
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
        <NodesTable nodes={this.props.nodes.get('deployed')}
                    roles={this.props.roles}
                    isFetchingNodes={this.props.nodes.get('isFetching')}
                    dataOperationInProgress={this.props.nodes.get('dataOperationInProgress')}/>
      </Formsy.Form>
    );
  }
}
DeployedNodesTabPane.propTypes = {
  formErrors: ImmutablePropTypes.list,
  formFieldErrors: ImmutablePropTypes.map,
  nodes: ImmutablePropTypes.map,
  roles: ImmutablePropTypes.map
};
DeployedNodesTabPane.defaultProps = {
  formErrors: List(),
  formFieldErrors: Map()
};
