import StacksConstants from '../constants/StacksConstants';
import HeatApiService from '../services/HeatApiService';
import NotificationActions from '../actions/NotificationActions';
import HeatApiErrorHandler from '../services/HeatApiErrorHandler';

export default {
  fetchStacksPending() {
    return {
      type: StacksConstants.FETCH_STACKS_PENDING
    };
  },

  fetchStacksSuccess(data) {
    return {
      type: StacksConstants.FETCH_STACKS_SUCCESS,
      payload: data
    };
  },

  fetchStacksFailed(error) {
    return {
      type: StacksConstants.FETCH_STACKS_FAILED
    };
  },

  fetchStacks(planName) {
    return dispatch => {
      dispatch(this.fetchStacksPending());
      HeatApiService.getStacks().then(response => {
        dispatch(this.fetchStacksSuccess(response.stacks));
      }).catch(error => {
        dispatch(this.fetchStacksFailed(error));
      });
    };
  },

  getOvercloudInfoFailed(error) {
    return {
      type: StacksConstants.GET_OVERCLOUD_INFO_FAILED,
      payload: error
    };
  },

  getOvercloudInfoSuccess(data) {
    return {
      type: StacksConstants.GET_OVERCLOUD_INFO_SUCCESS,
      payload: data
    };
  },

  getOvercloudInfo(stack) {
    return dispatch => {
      HeatApiService.getOvercloudInfo(stack).then(response => {
        dispatch(this.getOvercloudInfoSuccess(response));
      }).catch(error => {
        dispatch(this.getOvercloudInfoFailed(error));
        console.error('Error retrieving overcloud info', error); //eslint-disable-line no-console
        let errorHandler = new HeatApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.nofify(error));
        });
      });
    };
  }
};
