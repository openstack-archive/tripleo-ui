import CurrentPlanActions from '../actions/CurrentPlanActions';
import { browserHistory } from 'react-router';
import MistralApiService from '../services/MistralApiService';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import NotificationActions from '../actions/NotificationActions';
import PlansConstants from '../constants/PlansConstants';
import StackActions from '../actions/StacksActions';
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
      MistralApiService.runAction('tripleo.list_plans').then((response) => {
        let plans = JSON.parse(response.output).result || [];
        dispatch(this.receivePlans(plans));
        dispatch(CurrentPlanActions.detectPlan(plans));
      }).catch((error) => {
        let errorHandler = new MistralApiErrorHandler(error);
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

  cancelCreatePlan () {
    return {
      type: PlansConstants.CANCEL_CREATE_PLAN
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

  createPlanFailed(errors) {
    return {
      type: PlansConstants.CREATE_PLAN_FAILED,
      payload: errors
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
        dispatch(this.createPlanFailed(errorHandler.errors));
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
            dispatch(this.createPlanFailed([{ title: 'Error', message: response.state_info }]));
          }
          else {
            dispatch(this.pollForPlanCreationWorkflow(planName, response.id));
          }
        }).catch((error) => {
          let errorHandler = new MistralApiErrorHandler(error);
          dispatch(this.createPlanFailed(errorHandler.errors));
        });
      }).catch((error) => {
        console.error('Error in PlansActions.createPlanFromTarball', error); //eslint-disable-line no-console
        let errorHandler = new SwiftApiErrorHandler(error);
        dispatch(this.createPlanFailed(errorHandler.errors));
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
          dispatch(this.createPlanFailed([{ title: 'Error', message: response.state_info }]));
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
        dispatch(this.createPlanFailed(errorHandler.errors));
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
  },

  deployPlanPending(planName) {
    return {
      type: PlansConstants.START_DEPLOYMENT_PENDING,
      payload: planName
    };
  },

  deployPlanSuccess(planName, data) {
    return {
      type: PlansConstants.START_DEPLOYMENT_SUCCESS,
      paylod: {
        data,
        planName
      }
    };
  },

  deployPlanFailed(planName, error) {
    return {
      type: PlansConstants.START_DEPLOYMENT_FAILED,
      payload: {
        error,
        planName
      }
    };
  },

  deployPlan(planName) {
    return dispatch => {
      dispatch(this.deployPlanPending(planName));
      TripleOApiService.deployPlan(planName).then((response) => {
        dispatch(this.deployPlanSuccess(planName, response));
        dispatch(StackActions.fetchStacks());
        dispatch(NotificationActions.notify({
          title: 'Deployment started',
          message: 'The Deployment has been successfully initiated',
          type: 'success'
        }));
      }).catch(error => {
        dispatch(this.deployPlanFailed(planName, error));
        let errorHandler = new TripleOApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
      });
    };
  }
};
