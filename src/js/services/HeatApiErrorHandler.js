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

import BaseHttpRequestErrorHandler
  from '../components/utils/BaseHttpRequestErrorHandler';
import LoginActions from '../actions/LoginActions';
import store from '../store';

export default class HeatApiErrorHandler extends BaseHttpRequestErrorHandler {
  _generateErrors(errorObj) {
    let errors = [];
    let error;
    // A weak check to find out if it's not an xhr object.
    if (!errorObj.status && errorObj.message) {
      errors.push({
        title: 'Error',
        message: errorObj.message
      });
      return errors;
    }
    switch (errorObj.status) {
      case 0:
        errors.push({
          title: 'Connection Error',
          message: 'Connection to Heat API is not available'
        });
        break;
      case 401:
        error = JSON.parse(errorObj.responseText).error;
        errors.push({
          title: 'Unauthorized',
          message: error.message
        });
        store.dispatch(LoginActions.logoutUser());
        break;
      case 404:
        error = JSON.parse(errorObj.responseText).error;
        errors.push({
          title: 'Not found',
          message: error.message
        });
        break;
      default:
        error = JSON.parse(errorObj.responseText).error;
        errors.push({
          title: 'Heat API',
          message: error.message
        });
        break;
    }
    return errors;
  }
}
