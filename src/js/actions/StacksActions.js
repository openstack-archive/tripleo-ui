import StacksConstants from '../constants/StacksConstants';
import HeatApiService from '../services/HeatApiService';

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
      });
    };
  }
};
