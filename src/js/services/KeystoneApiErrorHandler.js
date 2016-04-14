import BaseHttpRequestErrorHandler from '../components/utils/BaseHttpRequestErrorHandler';

export default class KeystoneApiErrorHandler extends BaseHttpRequestErrorHandler {
  _generateErrors(xmlHttpRequestError) {
    let errors = [];
    let error;
    switch(xmlHttpRequestError.status) {
    case 0:
      errors.push({
        title: 'Connection Error',
        message: 'Connection to Keystone is not available'
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

  // TODO(jtomasek): remove this, I am leaving this here just for example reasons
  // this function should be implemented by form related subclass.
  _generateFormFieldErrors() {
    return {};
  }
}
