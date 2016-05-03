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
  }
};
