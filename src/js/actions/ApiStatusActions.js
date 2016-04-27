import ApiStatusConstants from '../constants/ApiStatusConstants';
import HeatApiService from '../services/HeatApiService';
import IronicApiService from '../services/IronicApiService';
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

  fetchHeatApiRoot() {
    return dispatch => {
      dispatch(this.fetchApiPending(ApiStatusConstants.HEAT));
      HeatApiService.getRoot().then((response) => {
        dispatch(this.fetchApiSuccess(ApiStatusConstants.HEAT));
      }).catch(xhr => {
        // A root request to the Heat API always returns a 300 status code, so we count
        // that as success -- if there is also a `versions` property in the response body.
        let response = {};
        try {
          response = JSON.parse(xhr.response);
        } catch(e) {} // eslint-disable-line no-empty
        if(xhr.status === 300 && response.versions) {
          dispatch(this.fetchApiSuccess(ApiStatusConstants.HEAT));
        }
        else {
          console.error('Error retrieving ApiStatusActions.fetchHeatApiRoot', xhr); //eslint-disable-line no-console
          dispatch(this.fetchApiFailed(ApiStatusConstants.HEAT, xhr));
        }
      });
    };
  },

  fetchIronicApiRoot() {
    return dispatch => {
      dispatch(this.fetchApiPending(ApiStatusConstants.IRONIC));
      IronicApiService.getRoot().then((response) => {
        dispatch(this.fetchApiSuccess(ApiStatusConstants.IRONIC));
      }).catch(xhr => {
        console.error('Error retrieving ApiStatusActions.fetchIronicApiRoot', xhr); //eslint-disable-line no-console
        dispatch(this.fetchApiFailed(ApiStatusConstants.IRONIC, xhr));
      });
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
