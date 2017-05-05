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

class HorizontalCheckBox extends React.Component {
  changeValue(event) {
    this.props.setValue(event.target.checked);
  }

  render() {
    let divClasses = ClassNames({
      'form-group': true,
      'has-error': this.props.showError(),
      required: this.props.showRequired()
    });

    return (
      <div className={divClasses}>
        <label
          htmlFor={this.props.name}
          className={`${this.props.labelColumnClasses} control-label`}
        >
          {this.props.title}
        </label>
        <div className={this.props.inputColumnClasses}>
          <div className="checkbox">
            <label>
              <input
                type={this.props.type}
                name={this.props.name}
                ref={this.props.id}
                id={this.props.id}
                onChange={this.changeValue.bind(this)}
                checked={!!this.props.getValue()}
                value={this.props.getValue()}
              />
              <InputErrorMessage getErrorMessage={this.props.getErrorMessage} />
              <InputDescription description={this.props.description} />
            </label>
          </div>
        </div>
      </div>
    );
  }
}
HorizontalCheckBox.propTypes = {
  description: PropTypes.string,
  getErrorMessage: PropTypes.func,
  getValue: PropTypes.func,
  id: PropTypes.string.isRequired,
  inputColumnClasses: PropTypes.string.isRequired,
  isRequired: PropTypes.func,
  isValid: PropTypes.func,
  labelColumnClasses: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  setValue: PropTypes.func,
  showError: PropTypes.func,
  showRequired: PropTypes.func,
  title: PropTypes.string.isRequired,
  type: PropTypes.string
};
HorizontalCheckBox.defaultProps = {
  type: 'checkbox'
};
export default Formsy.HOC(HorizontalCheckBox);
