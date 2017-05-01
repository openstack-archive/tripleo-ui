import BaseHttpRequestErrorHandler
  from '../components/utils/BaseHttpRequestErrorHandler';
import LoginActions from '../actions/LoginActions';
import store from '../store';

export default class IronicApiErrorHandler extends BaseHttpRequestErrorHandler {
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
          message: 'Connection to Ironic is not available'
        });
        break;
      case 401:
        error = errorObj.responseText;
        errors.push({
          title: 'Unauthorized',
          message: error
        });
        store.dispatch(LoginActions.logoutUser());
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
