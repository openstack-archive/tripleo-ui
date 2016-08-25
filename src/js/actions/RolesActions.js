// import { normalize, arrayOf } from 'normalizr';

import NotificationActions from './NotificationActions';
import RolesConstants from '../constants/RolesConstants';
// import { roleSchema } from '../normalizrSchemas/roles';
import MistralApiService from '../services/MistralApiService';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';

export default {
  fetchRoles(planName) {
    return (dispatch, getState) => {
      dispatch(this.fetchRolesPending());

      MistralApiService.runAction('tripleo.list_roles', { container: planName })
      .then((response) => {
        dispatch(this.fetchRolesSuccess(JSON.parse(response.output).result));
      }).catch((error) => {
        console.error('Error in RolesAction.fetchRoles', error.stack || error); //eslint-disable-line no-console
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
