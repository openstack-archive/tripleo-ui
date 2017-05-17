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

import ClassNames from 'classnames';
import Formsy from 'formsy-react';
import PropTypes from 'prop-types';
import React from 'react';

import InputDescription from './InputDescription';
import InputErrorMessage from './InputErrorMessage';

class GenericInput extends React.Component {
  changeValue(event) {
    this.props.setValue(event.target.value);
  }

  render() {
    let divClasses = ClassNames({
      'form-group': true,
      'has-error': this.props.showError(),
      'has-success': this.props.isValid(),
      required: this.props.isRequired()
    });

    return (
      <div className={divClasses}>
        <label htmlFor={this.props.name} className="control-label">
          {this.props.title}
        </label>
        <input
          type={this.props.type}
          name={this.props.name}
          ref={this.props.name}
          id={this.props.name}
          className="form-control"
          onChange={this.changeValue.bind(this)}
          value={this.props.getValue()}
          placeholder={this.props.placeholder}
          disabled={this.props.disabled}
        />
        <InputErrorMessage getErrorMessage={this.props.getErrorMessage} />
        <InputDescription description={this.props.description} />
      </div>
    );
  }
}
GenericInput.propTypes = {
  description: PropTypes.string,
  disabled: PropTypes.bool,
  getErrorMessage: PropTypes.func,
  getValue: PropTypes.func,
  isRequired: PropTypes.func,
  isValid: PropTypes.func,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  setValue: PropTypes.func,
  showError: PropTypes.func,
  title: PropTypes.string.isRequired,
  type: PropTypes.string
};
GenericInput.defaultProps = {
  type: 'text'
};
export default Formsy.HOC(GenericInput);
