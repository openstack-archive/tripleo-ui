import { normalize, arrayOf } from 'normalizr';

import history from '../history';
import NotificationActions from '../actions/NotificationActions';
import PlansConstants from '../constants/PlansConstants';
import { planSchema } from '../normalizrSchemas/plans';
import TripleOApiService from '../services/TripleOApiService';
import TripleOApiErrorHandler from '../services/TripleOApiErrorHandler';
import HeatApiService from '../services/HeatApiService';

export default {
  requestPlans() {
    return {
      type: PlansConstants.REQUEST_PLANS
    };
  },

  receivePlans(plans) {
    return {
      type: PlansConstants.RECEIVE_PLANS,
      payload: plans
    };
  },

  planDetected(currentPlanName, conflict) {
    return {
      type: PlansConstants.PLAN_DETECTED,
      payload: {
        currentPlanName: currentPlanName,
        conflict: conflict
      }
    };
  },

  detectPlan(plans) {
    return (dispatch, getState) => {
      let state = getState();
      let plans = state.plans.get('all').map(plan => plan.get('name'));
      let conflict;
      let currentPlanName = state.plans.get('currentPlanName');
      let previousPlan = currentPlanName || getStoredPlan();
      // No plans present.
      if(plans.size < 1 ) {
        if(!previousPlan) {
          currentPlanName = undefined;
        }
      }
      // Plans present.
      // No previously chosen plan.
      else if(!previousPlan) {
        currentPlanName = plans.first();
      }
      // Previously chosen plan doesn't exist any more.
      else if(!plans.includes(previousPlan)) {
        conflict = previousPlan;
        currentPlanName = plans.first();
      }
      // No plan in state, but in localStorage
      else if(!currentPlanName && previousPlan) {
        currentPlanName = previousPlan;
      }
      storePlan(currentPlanName);
      dispatch(this.planDetected(currentPlanName, conflict));
    };
  },

  fetchPlans() {
    return dispatch => {
      dispatch(this.requestPlans());
      TripleOApiService.getPlans().then(response => {
        let normalizedData = normalize(response.plans, arrayOf(planSchema));
        dispatch(this.receivePlans(normalizedData));
        dispatch(this.detectPlan(normalizedData));
      }).catch(error => {
        console.error('Error retrieving plans PlansActions.fetchPlans', error.stack || error); //eslint-disable-line no-console
        dispatch(this.receivePlans(normalize([], arrayOf(planSchema))));
        dispatch(this.detectPlan(normalize([], arrayOf(planSchema))));
        let errorHandler = new TripleOApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
      });
    };
  },

  requestPlan() {
    return {
      type: PlansConstants.REQUEST_PLAN
    };
  },

  receivePlan(plan) {
    return {
      type: PlansConstants.RECEIVE_PLAN,
      payload: plan
    };
  },

  fetchPlan(planName) {
    return dispatch => {
      dispatch(this.requestPlan());
      TripleOApiService.getPlan(planName).then(response => {
        dispatch(this.receivePlan(response.plan));
      }).catch(error => {
        console.error('Error retrieving plan PlansActions.fetchPlan', error); //eslint-disable-line no-console
        let errorHandler = new TripleOApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
      });
    };
  },

  choosePlan(planName) {
    return dispatch => {
      dispatch(NotificationActions.notify({
        title: 'Plan Activated',
        message: 'The plan ' + planName + ' was activated.',
        type: 'success'
      }));
      storePlan(planName);
      dispatch(this.planChosen(planName));
    };
  },

  planChosen(planName) {
    return {
      type: PlansConstants.PLAN_CHOSEN,
      payload: planName
    };
  },

  updatingPlan(planName) {
    return {
      type: PlansConstants.UPDATING_PLAN,
      payload: planName
    };
  },

  planUpdated(planName) {
    return {
      type: PlansConstants.PLAN_UPDATED,
      payload: planName
    };
  },

  updatePlan(planName, planFiles) {
    return dispatch => {
      dispatch(this.updatingPlan(planName));
      TripleOApiService.updatePlan(
        planName,
        planFiles
      ).then(result => {
        dispatch(this.planUpdated(planName));
        dispatch(this.fetchPlans());
        history.pushState(null, '/plans/list');
        dispatch(NotificationActions.notify({
          title: 'Plan Updated',
          message: `The plan ${planName} was successfully updated.`,
          type: 'success'
        }));
      }).catch(error => {
        console.error('Error in PlansActions.updatePlan', error); //eslint-disable-line no-console
        let errorHandler = new TripleOApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
      });
    };
  },

  creatingPlan() {
    return {
      type: PlansConstants.CREATING_PLAN
    };
  },

  planCreated() {
    return {
      type: PlansConstants.PLAN_CREATED
    };
  },

  createPlan(planName, planFiles) {
    return dispatch => {
      dispatch(this.creatingPlan());
      TripleOApiService.createPlan(
        planName,
        planFiles
      ).then(result => {
        dispatch(this.planCreated(planName));
        dispatch(this.fetchPlans());
        history.pushState(null, '/plans/list');
        dispatch(NotificationActions.notify({
          title: 'Plan Created',
          message: `The plan ${planName} was successfully created.`,
          type: 'success'
        }));
      }).catch(error => {
        console.error('Error in PlansActions.createPlan', error); //eslint-disable-line no-console
        let errorHandler = new TripleOApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
      });
    };
  },

  deletingPlan(planName) {
    return {
      type: PlansConstants.DELETING_PLAN,
      payload: planName
    };
  },

  planDeleted(planName) {
    return {
      type: PlansConstants.PLAN_DELETED,
      payload: planName
    };
  },

  deletePlan(planName) {
    return dispatch => {
      dispatch(this.deletingPlan(planName));
      history.pushState(null, '/plans/list');
      TripleOApiService.deletePlan(planName).then(response => {
        dispatch(this.planDeleted(planName));
        dispatch(this.fetchPlans());
        dispatch(NotificationActions.notify({
          title: 'Plan Deleted',
          message: `The plan ${planName} was successfully deleted.`,
          type: 'success'
        }));
      }).catch(error => {
        console.error('Error retrieving plan TripleOApiService.deletePlan', error); //eslint-disable-line no-console
        dispatch(this.planDeleted(planName));
        let errorHandler = new TripleOApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
      });
    };
  },

  fetchStacksPending() {
    return {
      type: PlansConstants.FETCH_STACK_PENDING
    };
  },

  fetchStacksSuccess(data) {
    return {
      type: PlansConstants.FETCH_STACK_SUCCESS,
      payload: data
    };
  },

  fetchStacksFailed(error) {
    return {
      type: PlansConstants.FETCH_STACK_FAILED
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

function storePlan(name) {
  if(window && window.localStorage) {
    if(!name) {
      window.localStorage.removeItem('currentPlanName');
    }
    else {
      window.localStorage.setItem('currentPlanName', name);
    }
  }
}

function getStoredPlan() {
  if(window && window.localStorage) {
    return window.localStorage.getItem('currentPlanName');
  }
  return null;
}
