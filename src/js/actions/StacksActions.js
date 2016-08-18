import { normalize, arrayOf } from 'normalizr';

import StacksConstants from '../constants/StacksConstants';
import HeatApiService from '../services/HeatApiService';
import { stackResourceSchema } from '../normalizrSchemas/stacks';

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

  fetchResourcesPending() {
    return {
      type: StacksConstants.FETCH_RESOURCES_PENDING
    };
  },

  fetchResourcesFailed() {
    return {
      type: StacksConstants.FETCH_RESOURCES_FAILED
    };
  },

  fetchResourcesSuccess(stackName, resources) {
    return {
      type: StacksConstants.FETCH_RESOURCES_SUCCESS,
      payload: {
        stackName: stackName,
        resources: resources
      }
    };
  },

  fetchResources(stackName, stackId) {
    return (dispatch) => {
      dispatch(this.fetchResourcesPending());
      HeatApiService.getResources(stackName, stackId).then((response) => {
        dispatch(this.fetchResourcesSuccess(
          stackName,
          normalize(response.resources, arrayOf(stackResourceSchema)).entities.stackResources));
      }).catch((error) => {
        dispatch(this.fetchResourcesFailed(error));
      });
    };
  }

};
