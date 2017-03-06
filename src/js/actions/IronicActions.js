import logger from '../services/logger';
import NotificationActions from './NotificationActions';
import LoginActions from './LoginActions';

export const handleIronicErrors = error => {
  return dispatch => {
    switch (true) {
    case (error.name === 'ServiceUrlNotFoundError'):
      logger.error(error.name, error);
      dispatch(NotificationActions.notify({
        title: 'Service URL Not found',
        message: error.message
      }));
      break;
    case (error.toString() === 'TypeError: Failed to fetch'):
      // request timeouted, could not get cors -> url is wrong, there is no connection etc.
      logger.error(error, 'Could not etablish connection to Ironic API, check app config');
      dispatch(NotificationActions.notify({
        title: 'Connection Error',
        message: 'Connection to Ironic API is not available'
      }));
      break;
    case (error.name === 'ApiResponseError'):
      logger.error(error.name, error, error.response);
      dispatch(handleIronicApiResponseError(error));
      break;
    default:
      logger.error(error.name, error);
    }
  };
};

const handleIronicApiResponseError = error => {
  return dispatch => {
    switch (error.response.status) {
    case 404:
      dispatch(NotificationActions.notify({
        title: `${error.response.status} ${error.response.statusText}`,
        message: error.response.url
      }));
      break;
    case 401:
      dispatch(NotificationActions.notify({
        title: `${error.response.statusText}`,
        message: JSON.parse(error.response.text).error.message
      }));
      dispatch(LoginActions.logoutUser());
      break;
    default:
      dispatch(NotificationActions.notify({
        title: `${error.response.status} ${error.response.statusText}`,
        message: error.response.text
      }));
    }
  };
};
