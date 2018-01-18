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

import { withFormsy } from 'formsy-react';
import PropTypes from 'prop-types';
import React from 'react';

import InputDescription from './InputDescription';
import InputErrorMessage from './InputErrorMessage';

class HorizontalSelect extends React.Component {
  changeValue(event) {
    event.stopPropagation();
    this.props.setValue(event.target.value);
  }

  render() {
    return (
      <div className="form-group">
        <label
          htmlFor={this.props.name}
          className={`${this.props.labelColumnClasses} control-label`}
        >
          {this.props.title}
        </label>
        <div className={this.props.inputColumnClasses}>
          <select
            name={this.props.name}
            ref={this.props.name}
            id={this.props.name}
            className="form-control"
            onChange={this.changeValue.bind(this)}
            value={this.props.getValue()}
          >
            {this.props.children}
          </select>
          <InputErrorMessage getErrorMessage={this.props.getErrorMessage} />
          <InputDescription description={this.props.description} />
        </div>
      </div>
    );
  }
}
HorizontalSelect.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element
  ]),
  description: PropTypes.string,
  getErrorMessage: PropTypes.func,
  getValue: PropTypes.func,
  inputColumnClasses: PropTypes.string.isRequired,
  labelColumnClasses: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  setValue: PropTypes.func,
  title: PropTypes.string.isRequired
};
HorizontalSelect.defaultProps = {
  inputColumnClasses: 'col-sm-10',
  labelColumnClasses: 'col-sm-2'
};
export default withFormsy(HorizontalSelect);
