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
