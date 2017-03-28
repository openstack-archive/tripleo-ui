import { Field, reduxForm } from 'redux-form';
import { FormGroup, MenuItem } from 'react-bootstrap';
import React from 'react';
import { startCase } from 'lodash';

import DropdownSelect from '../ui/reduxForm/DropdownSelect';
import { SortDirectionInput,
         ViewSelectorInput } from '../ui/Toolbar/ToolbarInputs';

const NodesToolbarForm = ({ handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <FormGroup>
      <Field
        name="sortBy"
        component={DropdownSelect}
        format={value => startCase(value)}>
        <MenuItem eventKey="name">Name</MenuItem>
        <MenuItem eventKey="power_state">Power State</MenuItem>
        <MenuItem eventKey="provision_state">Provision State</MenuItem>
      </Field>
      <Field name="sortDir" component={SortDirectionInput}/>
    </FormGroup>
    <FormGroup className="toolbar-pf-view-selector">
      <Field name="contentView" component={ViewSelectorInput}/>
    </FormGroup>
  </form>
);
NodesToolbarForm.propTypes = {
  children: React.PropTypes.node,
  handleSubmit: React.PropTypes.func.isRequired
};
export default reduxForm({
  form: 'nodesToolbar'
})(NodesToolbarForm);
