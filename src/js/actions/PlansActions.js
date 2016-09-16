import { fromJS } from 'immutable';
import { normalize, arrayOf } from 'normalizr';
import when from 'when';

import CurrentPlanActions from '../actions/CurrentPlanActions';
import { browserHistory } from 'react-router';
import MistralApiService from '../services/MistralApiService';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import NotificationActions from '../actions/NotificationActions';
import PlansConstants from '../constants/PlansConstants';
import { planFileSchema } from '../normalizrSchemas/plans';
import StackActions from '../actions/StacksActions';
import SwiftApiErrorHandler from '../services/SwiftApiErrorHandler';
import SwiftApiService from '../services/SwiftApiService';

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
      MistralApiService.runAction('tripleo.plan.list').then((response) => {
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

  receivePlan(planName, planFiles) {
    return {
      type: PlansConstants.RECEIVE_PLAN,
      payload: {
        planName: planName,
        planFiles: planFiles
      }
    };
  },

  fetchPlan(planName) {
    return dispatch => {
      dispatch(this.requestPlan());
      SwiftApiService.getContainer(planName).then(response => {
        dispatch(this.receivePlan(planName,
                                  normalize(response, arrayOf(planFileSchema)).entities.planFiles));
      }).catch(error => {
        console.error('Error retrieving plan PlansActions.fetchPlan', error); //eslint-disable-line no-console
        let errorHandler = new SwiftApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
      });
    };
  },

  updatePlanPending(planName) {
    return {
      type: PlansConstants.UPDATE_PLAN_PENDING,
      payload: planName
    };
  },

  updatePlanSuccess(planName) {
    return {
      type: PlansConstants.UPDATE_PLAN_SUCCESS,
      payload: planName
    };
  },

  updatePlanFailed(planName) {
    return {
      type: PlansConstants.UPDATE_PLAN_FAILED,
      payload: planName
    };
  },

  updatePlan(planName, planFiles) {
    return dispatch => {
      dispatch(this.updatePlanPending(planName));
      this._uploadFilesToContainer(planName, fromJS(planFiles), dispatch).then(() => {
        dispatch(this.updatePlanSuccess(planName));
        browserHistory.push('/plans/list');
        dispatch(NotificationActions.notify({
          title: 'Plan Updated',
          message: `The plan ${planName} was successfully updated.`,
          type: 'success'
        }));
        dispatch(this.fetchPlans());
      }).catch((errors) => {
        errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.updatePlanFailed(planName));
      });
    };
  },

  updatePlanFromTarball(planName, file) {
    return (dispatch) => {
      dispatch(this.updatePlanPending(planName));
      SwiftApiService.uploadTarball(planName, file).then((response) => {
        dispatch(this.updatePlanSuccess(planName));
        browserHistory.push('/plans/list');
        dispatch(NotificationActions.notify({
          title: 'Plan Updated',
          message: `The plan ${planName} was successfully updated.`,
          type: 'success'
        }));
        dispatch(this.fetchPlans());
      }).catch((error) => {
        console.error('Error in PlansActions.updatePlanFromTarball', error); //eslint-disable-line no-console
        let errorHandler = new SwiftApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.updatePlanFailed(planName));
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

  /*
   * Uploads a number of files to a container.
   * Returns a promise which gets resolved when all files are uploaded
   * or rejected if >= 1 objects fail.
   * @container: String
   * @files: Immutable Map
   */
  _uploadFilesToContainer(container, files, dispatch) {
    let uploadedFiles = 0;
    return when.promise((resolve, reject) => {
      files.forEach((value, key) => {
        SwiftApiService.createObject(container, key, value.get('contents')).then((response) => {
          // On success increase nr of uploaded files.
          // If this is the last file in the map, resolve the promise.
          if(uploadedFiles === files.size - 1) {
            resolve();
          }
          uploadedFiles += 1;
        }).catch((error) => {
          // Reject the promise on the first file that fails.
          console.error('Error in PlansActions.createPlan', error); //eslint-disable-line no-console
          let errorHandler = new SwiftApiErrorHandler(error);
          reject(errorHandler.errors);
        });
      });
    });
  },

  createPlan(planName, planFiles) {
    return (dispatch, getState) => {
      dispatch(this.createPlanPending());
      SwiftApiService.createContainer(planName).then((response) => {
        // Upload all files to container first.
        this._uploadFilesToContainer(planName, fromJS(planFiles), dispatch).then(() => {

          // Once all files are uploaded, start plan creation workflow.
          MistralApiService.runWorkflow(
            'tripleo.plan_management.v1.create_deployment_plan',
            { container: planName }
          ).then((response) => {
            if(response.state === 'ERROR') {
              console.error('Error in PlansActions.createPlan', response); //eslint-disable-line no-console
              dispatch(NotificationActions.notify({
                title: 'Error',
                message: response.state_info
              }));
              dispatch(this.createPlanFailed());
            }
          }).catch((error) => {
            console.error('Error in PlansActions.createPlan', error); //eslint-disable-line no-console
            let errorHandler = new MistralApiErrorHandler(error);
            errorHandler.errors.forEach((error) => {
              dispatch(NotificationActions.notify(error));
            });
            dispatch(this.createPlanFailed());
          });

        }).catch((errors) => {
          // If the file upload fails, just notify the user
          errors.forEach((error) => {
            dispatch(NotificationActions.notify(error));
          });
          dispatch(this.createPlanFailed());
        });

      }).catch((error) => {
        console.error('Error in PlansActions.createPlan', error); //eslint-disable-line no-console
        let errorHandler = new SwiftApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.createPlanFailed());
      });
    };
  },

  createPlanFinished(payload) {
    return (dispatch) => {
      if(payload.status === 'SUCCESS') {
        dispatch(this.createPlanSuccess());
        dispatch(NotificationActions.notify({
          type: 'success',
          title: 'Plan was created',
          message: `The plan ${payload.execution.input.container} was successfully created`
        }));
        dispatch(this.fetchPlans());
        browserHistory.push('/plans/list');
      }
      else {
        dispatch(this.createPlanFailed());
        dispatch(NotificationActions.notify({
          type: 'error',
          title: 'Plan creation error',
          message: payload.message
        }));
      }
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

  deletePlanPending(planName) {
    return {
      type: PlansConstants.DELETE_PLAN_PENDING,
      payload: planName
    };
  },

  deletePlanSuccess(planName) {
    return {
      type: PlansConstants.DELETE_PLAN_SUCCESS,
      payload: planName
    };
  },

  deletePlanFailed(planName) {
    return {
      type: PlansConstants.DELETE_PLAN_FAILED,
      payload: planName
    };
  },

  deletePlan(planName) {
    return dispatch => {
      dispatch(this.deletePlanPending(planName));
      browserHistory.push('/plans/list');
      MistralApiService.runAction('tripleo.plan.delete', { container: planName }).then(response => {
        dispatch(this.deletePlanSuccess(planName));
        dispatch(NotificationActions.notify({
          title: 'Plan Deleted',
          message: `The plan ${planName} was successfully deleted.`,
          type: 'success'
        }));
      }).catch(error => {
        console.error('Error deleting plan MistralApiService.runAction', error); //eslint-disable-line no-console
        dispatch(this.planDeleted(planName));
        let errorHandler = new MistralApiErrorHandler(error);
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

  deployPlanSuccess(planName) {
    return {
      type: PlansConstants.START_DEPLOYMENT_SUCCESS,
      payload: planName
    };
  },

  deployPlanFailed(planName) {
    return {
      type: PlansConstants.START_DEPLOYMENT_FAILED,
      payload: planName
    };
  },

  deployPlanFinished(payload) {
    return (dispatch) => {
      if(payload.status === 'FAILED') {
        dispatch(this.deployPlanFailed(payload.execution.input.container));
        dispatch(NotificationActions.notify({
          title: 'Deployment failed',
          message: payload.message,
          type: 'error'
        }));
      }
      else {
        dispatch(this.deployPlanSuccess(payload.execution.input.container));
        dispatch(StackActions.fetchStacks());
      }
    };
  },

  deployPlan(planName) {
    return dispatch => {
      dispatch(this.deployPlanPending(planName));
      MistralApiService.runWorkflow(
        'tripleo.deployment.v1.deploy_plan',
        { container: planName, timeout: 240
      }).then((response) => {
        dispatch(StackActions.fetchStacks());
      }).catch(error => {
        dispatch(this.deployPlanFailed(planName));
        let errorHandler = new MistralApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
      });
    };
  }
};
