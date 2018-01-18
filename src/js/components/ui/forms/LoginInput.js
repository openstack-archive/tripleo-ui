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

import InputErrorMessage from './InputErrorMessage';

class LoginInput extends React.Component {
  changeValue(event) {
    this.props.setValue(event.target.value);
  }

  render() {
    return (
      <div className="form-group">
        <label
          className="col-sm-2 col-md-2 control-label"
          htmlFor={this.props.name}
        >
          {this.props.title}
        </label>
        <div className="col-sm-10 col-md-10">
          <input
            type={this.props.type}
            name={this.props.name}
            ref={this.props.name}
            className="form-control"
            id={this.props.name}
            onChange={this.changeValue.bind(this)}
            value={this.props.getValue() || ''}
            placeholder={this.props.placeholder}
            autoFocus={this.props.autoFocus}
          />
          <InputErrorMessage getErrorMessage={this.props.getErrorMessage} />
        </div>
      </div>
    );
  }
}
LoginInput.propTypes = {
  autoFocus: PropTypes.bool,
  getErrorMessage: PropTypes.func,
  getValue: PropTypes.func,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  setValue: PropTypes.func,
  title: PropTypes.string.isRequired,
  type: PropTypes.string
};
LoginInput.defaultProps = {
  autoFocus: false,
  type: 'text'
};
export default withFormsy(LoginInput);
