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

import React, { PropTypes } from 'react';
import * as _ from 'lodash';

import FormErrorList from './FormErrorList';

export default class ModalFormErrorList extends React.Component {
  render() {
    if (_.isEmpty(this.props.errors)) {
      return null;
    } else {
      return (
        <div className="modal-form-error-list">
          <FormErrorList errors={this.props.errors}/>
        </div>
      );
    }
  }
}
ModalFormErrorList.propTypes = {
  errors: PropTypes.array.isRequired
};
