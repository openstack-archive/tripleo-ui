import { normalize, arrayOf } from 'normalizr';

import CurrentPlanActions from '../actions/CurrentPlanActions';
import { browserHistory } from 'react-router';
import NotificationActions from '../actions/NotificationActions';
import PlansConstants from '../constants/PlansConstants';
import { planSchema } from '../normalizrSchemas/plans';
import TripleOApiService from '../services/TripleOApiService';
import TripleOApiErrorHandler from '../services/TripleOApiErrorHandler';

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

  fetchPlans() {
    return dispatch => {
      dispatch(this.requestPlans());
      TripleOApiService.getPlans().then(response => {
        let normalizedData = normalize(response.plans, arrayOf(planSchema));
        dispatch(this.receivePlans(normalizedData));
        dispatch(CurrentPlanActions.detectPlan(normalizedData));
      }).catch(error => {
        console.error('Error retrieving plans PlansActions.fetchPlans', error.stack || error); //eslint-disable-line no-console
        dispatch(this.receivePlans(normalize([], arrayOf(planSchema))));
        dispatch(CurrentPlanActions.detectPlan(normalize([], arrayOf(planSchema))));
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
        browserHistory.push('/plans/list');
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
        browserHistory.push('/plans/list');
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
      browserHistory.push('/plans/list');
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
  }
};
