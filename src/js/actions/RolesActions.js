import { normalize, arrayOf } from 'normalizr';

// import NotificationActions from './NotificationActions';
import RolesConstants from '../constants/RolesConstants';
import roles from '../mockData/roles';
import { roleSchema } from '../normalizrSchemas/roles';

export default {
  fetchRoles() {
    return (dispatch, getState) => {
      dispatch(this.fetchRolesPending());

      // fake the reques/response delay
      const normalizedRoles = normalize(roles, arrayOf(roleSchema)).entities.roles;
      setTimeout(() => dispatch(this.fetchRolesSuccess(normalizedRoles)), 500);

      // TODO(jtomasek): Use this when roles are fetched from Heat
      // HeatApiService.getRoles().then((response) => {
      //   response = normalize(response, arrayOf(roleSchema));
      //   dispatch(this.fetchRolesSuccess(response));
      // }).catch((error) => {
      //   console.error('Error in RolesAction.fetchRoles', error.stack || error); //eslint-disable-line no-console
      //   dispatch(this.fetchRolesFailed());
      //   let errorHandler = new HeatApiErrorHandler(error);
      //   errorHandler.errors.forEach((error) => {
      //     dispatch(NotificationActions.notify(error));
      //   });
      // });
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
