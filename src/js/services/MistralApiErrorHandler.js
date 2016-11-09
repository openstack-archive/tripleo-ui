import BaseHttpRequestErrorHandler from '../components/utils/BaseHttpRequestErrorHandler';
import LoginActions from '../actions/LoginActions';
import store from '../store';

export default class MistralApiErrorHandler extends BaseHttpRequestErrorHandler {
  _generateErrors(errorObj) {
    let errors = [];
    let error;
    // A weak check to find out if it's not an xhr object.
    if(!errorObj.status && errorObj.message) {
      errors.push({
        title: 'Error',
        message: errorObj.message
      });
      return errors;
    }
    switch(errorObj.status) {
    case 0:
      errors.push({
        title: 'Connection Error',
        message: 'Connection to Mistral API is not available'
      });
      break;
    case 401:
      error = JSON.parse(errorObj.responseText);
      errors.push({
        title: error.title,
        message: error.description
      });
      store.dispatch(LoginActions.logoutUser());
      break;
    case 400: {
      let error = JSON.parse(errorObj.responseText).faultstring;
      errors.push({
        title: 'Bad Request',
        message: error
      });
      break;
    }
    case 'Action ERROR':
      errors.push({
        title: 'Failed to run Action',
        message: errorObj.message
      });
      store.dispatch(LoginActions.logoutUser());
      break;
    default:
      errors.push({
        title: errorObj.statusText,
        message: errorObj.responseText
      });
      break;
    }
    return errors;
  }
}
