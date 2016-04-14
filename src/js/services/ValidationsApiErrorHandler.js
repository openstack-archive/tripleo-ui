import BaseHttpRequestErrorHandler from '../components/utils/BaseHttpRequestErrorHandler';

export default class ValidationsApiErrorHandler extends BaseHttpRequestErrorHandler {
  _generateErrors(xmlHttpRequestError) {
    let errors = [];
    let error;
    switch(xmlHttpRequestError.status) {
    case 0:
      errors.push({
        title: 'Connection Error',
        message: 'Connection to Validations API is not available'
      });
      break;
    case 401:
      error = JSON.parse(xmlHttpRequestError.responseText).error;
      errors.push({
        title: 'Unauthorized',
        message: error.message
      });
      break;
    default:
      break;
    }
    return errors;
  }
}
