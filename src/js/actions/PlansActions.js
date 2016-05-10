import { normalize, arrayOf } from 'normalizr';

import CurrentPlanActions from '../actions/CurrentPlanActions';
import { browserHistory } from 'react-router';
import MistralApiService from '../services/MistralApiService';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import NotificationActions from '../actions/NotificationActions';
import PlansConstants from '../constants/PlansConstants';
import { planSchema } from '../normalizrSchemas/plans';
import SwiftApiErrorHandler from '../services/SwiftApiErrorHandler';
import SwiftApiService from '../services/SwiftApiService';
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

  createPlanPending() {
    return {
      type: PlansConstants.CREATE_PLAN_PENDING
    };
  },

  createPlanSuccess() {
    return {
      type: PlansConstants.CREATE_PLAN_SUCCESS
    };
  },

  createPlanFailed() {
    return {
      type: PlansConstants.CREATE_PLAN_FAILED
    };
  },

  createPlan(planName, planFiles) {
    return dispatch => {
      dispatch(this.createPlanPending());
      TripleOApiService.createPlan(planName, planFiles).then(result => {
        dispatch(this.createPlanSuccess(planName));
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
        // TODO(flfuchs) Set errors as form errors instead showing a notification.
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.createPlanFailed());
      });
    };
  },

  createPlanFromTarball(planName, file) {
    return (dispatch) => {
      dispatch(this.createPlanPending());
      SwiftApiService.uploadTarball(planName, file).then((response) => {
        MistralApiService.runWorkflow(
          'tripleo.plan_management.v1.create_deployment_plan',
          { container: planName }
        ).then((response) => {
          if(response.state === 'ERROR') {
            console.error('Error in PlansActions.createPlanFromTarball', response); //eslint-disable-line no-console
            // TODO(flfuchs) Set errors as form errors instead showing a notification.
            dispatch(NotificationActions.notify({ title: 'Error', message: response.state_info }));
            dispatch(this.createPlanFailed());
          }
          else {
            dispatch(this.pollForPlanCreationWorkflow(planName, response.id));
          }
        }).catch((error) => {
          let errorHandler = new MistralApiErrorHandler(error);
          // TODO(flfuchs) Set errors as form errors instead showing a notification.
          errorHandler.errors.forEach((error) => {
            dispatch(NotificationActions.notify(error));
          });
          dispatch(this.createPlanFailed());
        });
      }).catch((error) => {
        console.error('Error in PlansActions.createPlanFromTarball', error); //eslint-disable-line no-console
        let errorHandler = new SwiftApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          // TODO(flfuchs) Set errors as form errors instead showing a notification.
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.createPlanFailed());
      });
    };
  },

  pollForPlanCreationWorkflow(planName, workflowExecutionId) {
    return (dispatch, getState) => {
      MistralApiService.getWorkflowExecution(workflowExecutionId)
      .then((response) => {
        if(response.state === 'RUNNING') {
          setTimeout(() => {
            dispatch(this.pollForPlanCreationWorkflow(planName, workflowExecutionId));
          }, 5000);
        }
        else if(response.state === 'ERROR') {
          dispatch(NotificationActions.notify({ title: 'Error', message: response.state_info }));
        }
        else {
          dispatch(this.createPlanSuccess(planName));
          dispatch(this.fetchPlans());
          dispatch(NotificationActions.notify({
            type: 'success',
            title: 'Plan was created',
            message: `The plan ${planName} was successfully created`
          }));
          browserHistory.push('/plans/list');
        }
      }).catch((error) => {
        let errorHandler = new MistralApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.finishOperation());
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
