import { Button, FormGroup, InputGroup, MenuItem } from 'react-bootstrap';
import React from 'react';
import { Field, reduxForm } from 'redux-form';

import DropdownSelect from '../reduxForm/DropdownSelect';

class ToolbarFiltersForm extends React.Component {
  submit(data) {
    this.props.onSubmit(data);
    this.props.initialize({ filterBy: data.filterBy });
  }

  renderFilterByOptions() {
    const { options } = this.props;
    return Object.keys(options).map(k => (
      <MenuItem key={k} eventKey={k}>{options[k]}</MenuItem>
    ));
  }

  renderFilterStringField() {
    return (
      <Field
        validate={(value) => value ? undefined : 'Required'}
        autoComplete="off"
        name="filterString"
        component="input"
        placeholder={this.props.placeholder}
        className="form-control" />
    );
  }

  render() {
    const { formatSelectValue, handleSubmit, options } = this.props;
    return (
      <form onSubmit={handleSubmit(this.submit.bind(this))}>
        <FormGroup className="toolbar-pf-filter">
          {options
            ? <InputGroup>
                <InputGroup.Button>
                  <Field
                    name="filterBy"
                    component={DropdownSelect}
                    format={formatSelectValue}>
                    {this.renderFilterByOptions()}
                  </Field>
                </InputGroup.Button>
                {this.renderFilterStringField()}
              </InputGroup>
            : this.renderFilterStringField()}
        </FormGroup>
      </form>
    );
  }
}
ToolbarFiltersForm.propTypes = {
  form: React.PropTypes.string.isRequired,
  formatSelectValue: React.PropTypes.func,
  handleSubmit: React.PropTypes.func.isRequired,
  initialValues: React.PropTypes.object,
  initialize: React.PropTypes.func.isRequired,
  onSubmit: React.PropTypes.func.isRequired,
  options: React.PropTypes.object,
  placeholder: React.PropTypes.string
};
ToolbarFiltersForm.defaultProps = {
  placeholder: 'Add filter'
};
export default reduxForm()(ToolbarFiltersForm);
