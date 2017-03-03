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

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { getEnabledLanguages } from '../../services/utils';

class LanguageInput extends React.Component {
  _renderOptions() {
    return getEnabledLanguages()
      .map((langName, langKey) => {
        return (
          <option key={`lang-${langKey}`} value={langKey}>
            {langName}
          </option>
        );
      })
      .toList();
  }

  _onChange(event) {
    this.props.chooseLanguage(event.currentTarget.value);
  }

  render() {
    return (
      <div className="form-group">
        <label
          className="col-sm-2 col-md-2 control-label"
          htmlFor={this.props.name}
        />
        <div className="col-sm-4 col-sm-offset-6 col-md-4 col-md-offset-6">
          <select
            className="combobox form-control"
            name={this.props.name}
            value={this.props.language}
            autoFocus={this.props.autoFocus}
            onChange={this._onChange.bind(this)}
          >
            {this._renderOptions()}
          </select>
        </div>
      </div>
    );
  }
}

LanguageInput.propTypes = {
  autoFocus: PropTypes.bool,
  chooseLanguage: PropTypes.func.isRequired,
  language: PropTypes.string,
  name: PropTypes.string.isRequired
};

LanguageInput.defaultProps = {
  autoFocus: false
};

export default injectIntl(LanguageInput);
