import BaseHttpRequestErrorHandler from '../components/utils/BaseHttpRequestErrorHandler';

export default class IronicApiErrorHandler extends BaseHttpRequestErrorHandler {
  _generateErrors(xmlHttpRequestError) {
    let errors = [];
    let error;
    switch(xmlHttpRequestError.status) {
    case 0:
      errors.push({
        title: 'Connection Error',
        message: 'Connection to Ironic is not available'
      });
      break;
    case 401:
      error = xmlHttpRequestError.responseText;
      errors.push({
        title: 'Unauthorized',
        message: error
      });
      break;
    default:
      error = xmlHttpRequestError.responseText;
      status = xmlHttpRequestError.status;
      errors.push({
        title: `Error ${status}`,
        message: error
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
