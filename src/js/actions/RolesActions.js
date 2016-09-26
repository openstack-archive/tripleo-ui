import NotificationActions from './NotificationActions';
import RolesConstants from '../constants/RolesConstants';
import MistralApiService from '../services/MistralApiService';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import MistralConstants from '../constants/MistralConstants';
import logger from '../services/logger';

export default {
  fetchRoles(planName) {
    return (dispatch, getState) => {
      dispatch(this.fetchRolesPending());

      MistralApiService.runAction(MistralConstants.ROLE_LIST, { container: planName })
      .then((response) => {
        dispatch(this.fetchRolesSuccess(JSON.parse(response.output).result));
      }).catch((error) => {
        logger.error('Error in RolesAction.fetchRoles', error.stack || error);
        dispatch(this.fetchRolesFailed());
        let errorHandler = new MistralApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
      });
    };
  },

  fetchRolesPending() {
    return {
      type: RolesConstants.FETCH_ROLES_PENDING
    };
  },

  fetchRolesSuccess(roles) {
    return {
      type: RolesConstants.FETCH_ROLES_SUCCESS,
      payload: roles
    };
  },

  fetchRolesFailed() {
    return {
      type: RolesConstants.FETCH_ROLES_FAILED
    };
  }
};
