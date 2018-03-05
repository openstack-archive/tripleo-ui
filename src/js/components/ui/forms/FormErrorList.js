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

import PropTypes from 'prop-types';
import React from 'react';
import { isEmpty } from 'lodash';

export default class FormErrorList extends React.Component {
  renderErrors() {
    const { errors } = this.props;
    if (errors.length > 1) {
      const errorList = errors.map((error, index) => {
        return (
          <li key={index}>
            {error.title} {error.message}
          </li>
        );
      });
      return (
        <div>
          <strong>{`${errors.length} Errors Found:`}</strong>
          <ul>{errorList}</ul>
        </div>
      );
    } else {
      return (
        <p>
          {errors[0].title && <strong>{errors[0].title}</strong>}{' '}
          {errors[0].message}
        </p>
      );
    }
  }

  render() {
    if (isEmpty(this.props.errors)) {
      return null;
    } else {
      return (
        <div className="form-error-list alert alert-danger" role="alert">
          <span className="pficon pficon-error-circle-o" aria-hidden="true" />
          {this.renderErrors()}
        </div>
      );
    }
  }
}
FormErrorList.propTypes = {
  errors: PropTypes.array.isRequired
};
