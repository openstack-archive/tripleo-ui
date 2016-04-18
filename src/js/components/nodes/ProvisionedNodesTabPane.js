import * as _ from 'lodash';
import { List, Map } from 'immutable';
import Formsy from 'formsy-react';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import FormErrorList from '../ui/forms/FormErrorList';
import NodesTable from './NodesTable';

export default class ProvisionedNodesTabPane extends React.Component {
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
    if(_.includes(_.values(this.refs.provisionedNodesTableForm.getCurrentValues()), true)) {
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
    this.refs.provisionedNodesTableForm.updateInputsWithError(formFieldErrors);
  }

  handleSubmit(formData, resetForm, invalidateForm) {
    // const data = this._convertFormData(formData);
    // const formFields = Object.keys(this.refs.provisionedNodesTableForm.inputs);
    this.disableButton();
    resetForm();
  }

  render() {
    return (
      <Formsy.Form ref="provisionedNodesTableForm"
                   role="form"
                   className="form"
                   onSubmit={this.handleSubmit.bind(this)}
                   onValid={this.canSubmit.bind(this)}
                   onInvalid={this.disableButton.bind(this)}>
        <FormErrorList errors={this.props.formErrors.toJS()}/>
        <NodesTable nodes={this.props.nodes.get('provisioned')}
                    roles={this.props.roles}
                    isFetchingNodes={this.props.nodes.get('isFetching')}
                    dataOperationInProgress={this.props.nodes.get('dataOperationInProgress')}/>
      </Formsy.Form>
    );
  }
}
ProvisionedNodesTabPane.propTypes = {
  formErrors: ImmutablePropTypes.list,
  formFieldErrors: ImmutablePropTypes.map,
  nodes: ImmutablePropTypes.map,
  roles: ImmutablePropTypes.map
};
ProvisionedNodesTabPane.defaultProps = {
  formErrors: List(),
  formFieldErrors: Map()
};
