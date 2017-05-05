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

/**
 * @class
 * @classdesc Implements base for API and Form error handling
 */
export default class BaseHttpRequestErrorHandler{
  constructor(xmlHttpRequestError, formInputFieldNames) {
    this.xmlHttpRequestError = xmlHttpRequestError;
    this.formInputFieldNames = formInputFieldNames || [];
    this._errors = this._generateErrors(this.xmlHttpRequestError);
    this._formFieldErrors = this._generateFormFieldErrors(this.xmlHttpRequestError,
                                                          this.formInputFieldNames);
  }

  /**
    Generates errors
    @param {object} xmlHttpRequestError - The Error object
    @returns {array} array of error objects with type, title and message properties
  */
  _generateErrors(xmlHttpRequestError) {
    return [];
  }

  /**
    Generates form field frrors
    @param {object} xmlHttpRequestError - The Error object
    @param {array} formInputFieldNames - array of strings with form field names
    @returns {object} object with with form field names as keys and error messages as
      values. e.g. {'username': 'Username does not exist'}
  */
  _generateFormFieldErrors(xmlHttpRequestError, formInputFieldNames) {
    return {};
  }

  get errors() {
    return this._errors;
  }

  get formFieldErrors() {
    return this._formFieldErrors;
  }
}
