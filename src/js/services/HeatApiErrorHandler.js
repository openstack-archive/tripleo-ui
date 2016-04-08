import BaseHttpRequestErrorHandler from '../components/utils/BaseHttpRequestErrorHandler';

export default class HeatApiErrorHandler extends BaseHttpRequestErrorHandler {
  _generateErrors(xmlHttpRequestError) {
    let errors = [];
    let error;
    switch(xmlHttpRequestError.status) {
    case 0:
      errors.push({
        title: 'Connection Error',
        message: 'Connection to Heat API is not available'
      });
      break;
    case 401:
      error = JSON.parse(xmlHttpRequestError.responseText).error;
      errors.push({
        title: 'Unauthorized',
        message: error.message
      });
      break;
    case 404:
      error = JSON.parse(xmlHttpRequestError.responseText).error;
      errors.push({
        title: 'Not found',
        message: error.message
      });
      break;
    default:
      error = JSON.parse(xmlHttpRequestError.responseText).error;
      errors.push({
        title: 'Heat API',
        message: error.message
      });
      break;
    }
    return errors;
  }
}
