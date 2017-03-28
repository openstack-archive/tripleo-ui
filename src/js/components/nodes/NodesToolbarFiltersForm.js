import { Button, FormGroup, InputGroup, MenuItem } from 'react-bootstrap';
import { startCase } from 'lodash';
import React from 'react';
import { Field, reduxForm } from 'redux-form';

import DropdownSelect from '../ui/reduxForm/DropdownSelect';

class NodesToolbarFiltersForm extends React.Component {
  render() {
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <FormGroup className="toolbar-pf-filter">
          <InputGroup>
            <InputGroup.Button>
              <Field
                name="filterBy"
                component={DropdownSelect}
                format={value => startCase(value)}>
                <MenuItem eventKey="name">Name</MenuItem>
                <MenuItem eventKey="power_state">Power State</MenuItem>
                <MenuItem eventKey="provision_state">Provision State</MenuItem>
              </Field>
            </InputGroup.Button>
            <Field
              name="filterString"
              component="input"
              placeholder="Filter"
              className="form-control" />
          </InputGroup>
        </FormGroup>
      </form>
    );
  }
}
NodesToolbarFiltersForm.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired
};
export default reduxForm({
  form: 'nodesToolbarFilter',
  initialValues: { filterBy: 'name' }
})(NodesToolbarFiltersForm);
