/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { Button, FormGroup, InputGroup, MenuItem } from 'react-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'
import { Field, reduxForm } from 'redux-form'

import DropdownSelect from '../reduxForm/DropdownSelect'

class ToolbarFiltersForm extends React.Component {
  submit(data) {
    this.props.onSubmit(data)
    this.props.initialize({ filterBy: data.filterBy })
  }

  renderFilterByOptions() {
    const { options } = this.props
    return Object.keys(options).map(k => (
      <MenuItem key={k} eventKey={k}>{options[k]}</MenuItem>
    ))
  }

  renderFilterStringField() {
    return (
      <Field
        validate={value => (value ? undefined : 'Required')}
        autoComplete="off"
        name="filterString"
        component="input"
        placeholder={this.props.placeholder}
        className="form-control"
      />
    )
  }

  render() {
    const { formatSelectValue, handleSubmit, options } = this.props
    return (
      <form onSubmit={handleSubmit(this.submit.bind(this))}>
        <FormGroup className="toolbar-pf-filter">
          {options
            ? <InputGroup>
                <InputGroup.Button>
                  <Field
                    name="filterBy"
                    component={DropdownSelect}
                    format={formatSelectValue}
                  >
                    {this.renderFilterByOptions()}
                  </Field>
                </InputGroup.Button>
                {this.renderFilterStringField()}
              </InputGroup>
            : this.renderFilterStringField()}
        </FormGroup>
      </form>
    )
  }
}
ToolbarFiltersForm.propTypes = {
  form: PropTypes.string.isRequired,
  formatSelectValue: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  initialize: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  options: PropTypes.object,
  placeholder: PropTypes.string
}
ToolbarFiltersForm.defaultProps = {
  placeholder: 'Add filter'
}
export default reduxForm()(ToolbarFiltersForm)
