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
import React, { PropTypes } from 'react';

import InputDescription from './InputDescription';
import InputErrorMessage from './InputErrorMessage';

class HorizontalNumberInput extends React.Component {
  changeValue(event) {
    event.stopPropagation(); // https://github.com/christianalfoni/formsy-react/issues/203
    this.props.setValue(isNaN(parseInt(event.target.value)) ?
                          undefined : parseInt(event.target.value));
  }

  // https://github.com/christianalfoni/formsy-react/issues/332
  getValue() {
    if(this.props.getValue()) {
      return this.props.getValue();
    }
    return 0;
  }

  render() {
    let divClasses = ClassNames({
      'form-group': true,
      'has-error': this.props.showError(),
      'required': this.props.isRequired()
    });

    return (
      <div className={divClasses}>
        <label htmlFor={this.props.name}
               className={`${this.props.labelColumnClasses} control-label`}>
          {this.props.title}
        </label>
        <div className={this.props.inputColumnClasses}>
          <input type="number"
                 name={this.props.name}
                 ref={this.props.name}
                 id={this.props.name}
                 className="form-control"
                 onChange={this.changeValue.bind(this)}
                 value={this.getValue()}
                 placeholder={this.props.placeholder}
                 min={this.props.min}
                 max={this.props.max}
                 disabled={this.props.disabled} />
          <InputErrorMessage getErrorMessage={this.props.getErrorMessage} />
          <InputDescription description={this.props.description} />
        </div>
      </div>
    );
  }
}
HorizontalNumberInput.propTypes = {
  description: PropTypes.string,
  disabled: PropTypes.bool,
  getErrorMessage: PropTypes.func,
  getValue: PropTypes.func,
  inputColumnClasses: PropTypes.string.isRequired,
  isRequired: PropTypes.func,
  isValid: PropTypes.func,
  labelColumnClasses: PropTypes.string.isRequired,
  max: PropTypes.number,
  min: PropTypes.number,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  setValue: PropTypes.func,
  showError: PropTypes.func,
  title: PropTypes.string.isRequired
};
HorizontalNumberInput.defaultProps = {
  inputColumnClasses: 'col-sm-10',
  labelColumnClasses: 'col-sm-2'
};
export default Formsy.HOC(HorizontalNumberInput);
