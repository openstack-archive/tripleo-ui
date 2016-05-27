import BaseHttpRequestErrorHandler from '../components/utils/BaseHttpRequestErrorHandler';

export default class IronicApiErrorHandler extends BaseHttpRequestErrorHandler {
  _generateErrors(errorObj) {
    let errors = [];
    let error;
    if(!errorObj.constructor === XMLHttpRequest) {
      errors.push({
        title: 'Error',
        message: error
      });
      return errors;
    }
    switch(errorObj.status) {
    case 0:
      errors.push({
        title: 'Connection Error',
        message: 'Connection to Ironic is not available'
      });
      break;
    case 401:
      error = errorObj.responseText;
      errors.push({
        title: 'Unauthorized',
        message: error
      });
      break;
    default:
      error = errorObj.responseText;
      status = errorObj.status;
      errors.push({
        title: `Error ${status}`,
        message: errorObj
      });
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
