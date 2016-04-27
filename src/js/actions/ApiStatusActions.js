import ApiStatusConstants from '../constants/ApiStatusConstants';
import KeystoneApiService from '../services/KeystoneApiService';
import TripleOApiService from '../services/TripleOApiService';
import ValidationsApiService from '../services/ValidationsApiService';

export default {

  fetchApiPending(key) {
    return {
      type: ApiStatusConstants.FETCH_API_STATUS_PENDING,
      payload: {
        key: key
      }
    };
  },

  fetchApiSuccess(key) {
    return {
      type: ApiStatusConstants.FETCH_API_STATUS_SUCCESS,
      payload: {
        key: key
      }
    };
  },

  fetchApiFailed(key, error) {
    return {
      type: ApiStatusConstants.FETCH_API_STATUS_FAILED,
      payload: {
        key: key,
        error: error
      }
    };
  },

  fetchKeystoneApiRoot() {
    return dispatch => {
      dispatch(this.fetchApiPending(ApiStatusConstants.KEYSTONE));
      KeystoneApiService.getRoot().then((response) => {
        dispatch(this.fetchApiSuccess(ApiStatusConstants.KEYSTONE));
      }).catch(error => {
        console.error('Error retrieving ApiStatusActions.fetchKeystoneApiRoot', error); //eslint-disable-line no-console
        dispatch(this.fetchApiFailed(ApiStatusConstants.KEYSTONE, error));
      });
    };
  },

  fetchTripleOApiRoot() {
    return dispatch => {
      dispatch(this.fetchApiPending(ApiStatusConstants.TRIPLEO));
      TripleOApiService.getRoot().then((response) => {
        dispatch(this.fetchApiSuccess(ApiStatusConstants.TRIPLEO));
      }).catch(error => {
        console.error('Error retrieving ApiStatusActions.fetchTripleOApiRoot', error); //eslint-disable-line no-console
        dispatch(this.fetchApiFailed(ApiStatusConstants.TRIPLEO, error));
      });
    };
  },

  fetchValidationsApiRoot() {
    return dispatch => {
      dispatch(this.fetchApiPending(ApiStatusConstants.VALIDATIONS));
      ValidationsApiService.getRoot().then((response) => {
        dispatch(this.fetchApiSuccess(ApiStatusConstants.VALIDATIONS));
      }).catch(error => {
        console.error('Error retrieving ApiStatusActions.fetchValidationApiRoot', error); //eslint-disable-line no-console
        dispatch(this.fetchApiFailed(ApiStatusConstants.VALIDATIONS, error));
      });
    };
  }
};
