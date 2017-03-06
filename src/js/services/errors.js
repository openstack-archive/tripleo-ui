import BaseError from 'extendable-error-class';

/**
 * ApiResponseError is thrown on non ok response when using fetch
 */
export class ApiResponseError extends BaseError {
  constructor(response, responseText) {
    super(response.statusText);
    this.response = response;
    this.response.text = responseText;
  }
}

export class ServiceUrlNotFoundError extends BaseError {}
