import { defineMessages } from 'react-intl';
import { fromJS } from 'immutable';
import { normalize, arrayOf } from 'normalizr';
import when from 'when';

import CurrentPlanActions from '../actions/CurrentPlanActions';
import { browserHistory } from 'react-router';
import logger from '../services/logger';
import MistralApiService from '../services/MistralApiService';
import MistralApiErrorHandler from '../services/MistralApiErrorHandler';
import NotificationActions from '../actions/NotificationActions';
import PlansConstants from '../constants/PlansConstants';
import { planFileSchema } from '../normalizrSchemas/plans';
import StackActions from '../actions/StacksActions';
import SwiftApiErrorHandler from '../services/SwiftApiErrorHandler';
import SwiftApiService from '../services/SwiftApiService';
import MistralConstants from '../constants/MistralConstants';

const messages = defineMessages({
  planCreatedNotificationTitle: {
    id: 'PlansActions.planCreatedNotificationTitle',
    defaultMessage: 'Plan was created'
  },
  planCreatedNotificationMessage: {
    id: 'PlansActions.planCreatedNotificationMessage',
    defaultMessage: 'The plan {planName} was successfully created.'
  },
  planUpdatedNotificationTitle: {
    id: 'PlansActions.planUpdatedNotificationTitle',
    defaultMessage: 'Plan Updated'
  },
  planUpdatedNotificationMessage: {
    id: 'PlansActions.planUpdatedNotificationMessage',
    defaultMessage: 'The plan {planName} was successfully updated.'
  },
  planDeletedNotificationTitle: {
    id: 'PlansActions.planDeletedNotificationTitle',
    defaultMessage: 'Plan Deleted'
  },
  planDeletedNotificationMessage: {
    id: 'PlansActions.planDeletedNotificationMessage',
    defaultMessage: 'The plan {planName} was successfully deleted.'
  },
  deploymentFailedNotificationTitle: {
    id: 'PlansActions.deploymentFailedNotificationTitle',
    defaultMessage: 'Deployment Failed'
  }
});

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
      MistralApiService.runAction(MistralConstants.PLAN_LIST).then((response) => {
        let plans = JSON.parse(response.output).result || [];
        dispatch(this.receivePlans(plans));
        dispatch(CurrentPlanActions.detectPlan());
      }).catch((error) => {
        logger.error('Error in PlansActions.fetchPlans', error.stack || error);
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
        logger.error('Error retrieving plan PlansActions.fetchPlan', error.stack || error);
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
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      dispatch(this.updatePlanPending(planName));
      this._uploadFilesToContainer(planName, fromJS(planFiles), dispatch).then(() => {
        dispatch(this.updatePlanSuccess(planName));
        browserHistory.push('/plans/list');
        dispatch(NotificationActions.notify({
          title: formatMessage(messages.planUpdatedNotificationTitle),
          message: formatMessage(messages.planUpdatedNotificationMessage, { planName: planName }),
          type: 'success'
        }));
        dispatch(this.fetchPlans());
      }).catch((errors) => {
        logger.error('Error in PlansActions.updatePlan', errors);
        errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.updatePlanFailed(planName));
      });
    };
  },

  updatePlanFromTarball(planName, file) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      dispatch(this.updatePlanPending(planName));
      SwiftApiService.uploadTarball(planName, file).then((response) => {
        dispatch(this.updatePlanSuccess(planName));
        browserHistory.push('/plans/list');
        dispatch(NotificationActions.notify({
          title: formatMessage(messages.planUpdatedNotificationTitle),
          message: formatMessage(messages.planUpdatedNotificationMessage, { planName: planName }),
          type: 'success'
        }));
        dispatch(this.fetchPlans());
      }).catch((error) => {
        logger.error('Error in PlansActions.updatePlanFromTarball', error);
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
          logger.error('Error in PlansActions.createPlan', error);
          let errorHandler = new SwiftApiErrorHandler(error);
          reject(errorHandler.errors);
        });
      });
    });
  },

  createPlan(planName, planFiles) {
    return (dispatch, getState) => {
      dispatch(this.createPlanPending());
      MistralApiService.runAction(MistralConstants.CREATE_CONTAINER, {
        container: planName
      }).then((response) => {
        // Upload all files to container first.
        this._uploadFilesToContainer(planName, fromJS(planFiles), dispatch).then(() => {

          // Once all files are uploaded, start plan creation workflow.
          MistralApiService.runWorkflow(
            MistralConstants.PLAN_CREATE,
            { container: planName }
          ).then((response) => {
            if(response.state === 'ERROR') {
              logger.error('Error in PlansActions.createPlan', response);
              dispatch(NotificationActions.notify({
                title: 'Error',
                message: response.state_info
              }));
              dispatch(this.createPlanFailed());
            }
          }).catch((error) => {
            logger.error('Error in PlansActions.createPlan', error);
            let errorHandler = new MistralApiErrorHandler(error);
            errorHandler.errors.forEach((error) => {
              dispatch(NotificationActions.notify(error));
            });
            dispatch(this.createPlanFailed());
          });

        }).catch((errors) => {
          logger.error('Error in PlansActions.createPlan', errors);
          // If the file upload fails, just notify the user
          errors.forEach((error) => {
            dispatch(NotificationActions.notify(error));
          });
          dispatch(this.createPlanFailed());
        });

      }).catch((error) => {
        logger.error('Error in PlansActions.createPlan', error);
        let errorHandler = new MistralApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.createPlanFailed());
      });
    };
  },

  createPlanFinished(payload) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      if(payload.status === 'SUCCESS') {
        const planName = payload.execution.input.container;
        dispatch(this.createPlanSuccess());
        dispatch(NotificationActions.notify({
          type: 'success',
          title: formatMessage(messages.planCreatedNotificationTitle),
          message: formatMessage(messages.planCreatedNotificationMessage, { planName: planName })
        }));
        dispatch(this.fetchPlans());
        browserHistory.push('/plans/list');
      }
      else {
        dispatch(this.createPlanFailed([{ title: 'Error', message: payload.message }]));
      }
    };
  },

  createPlanFromTarball(planName, file) {
    return (dispatch) => {
      dispatch(this.createPlanPending());

      MistralApiService.runAction(MistralConstants.CREATE_CONTAINER, {
        container: planName
      }).then((response) => {


        SwiftApiService.uploadTarball(planName, file).then((response) => {
          MistralApiService.runWorkflow(
            MistralConstants.PLAN_CREATE,
            { container: planName }
          ).then((response) => {
            if(response.state === 'ERROR') {
              logger.error('Error in PlansActions.createPlanFromTarball', response);
              dispatch(this.createPlanFailed([{ title: 'Error', message: response.state_info }]));
            }
          }).catch((error) => {
            logger.error('Error in workflow in PlansActions.createPlanFromTarball', error);
            let errorHandler = new MistralApiErrorHandler(error);
            dispatch(this.createPlanFailed(errorHandler.errors));
          });
        }).catch((error) => {
          logger.error('Error in Swift in PlansActions.createPlanFromTarball', error);
          let errorHandler = new SwiftApiErrorHandler(error);
          dispatch(this.createPlanFailed(errorHandler.errors));
        });

      }).catch((error) => {
        logger.error('Error in PlansActions.createPlan', error);
        let errorHandler = new MistralApiErrorHandler(error);
        errorHandler.errors.forEach((error) => {
          dispatch(NotificationActions.notify(error));
        });
        dispatch(this.createPlanFailed());
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
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      dispatch(this.deletePlanPending(planName));
      browserHistory.push('/plans/list');
      MistralApiService.runAction(MistralConstants.PLAN_DELETE, { container: planName })
        .then(response => {
          dispatch(this.deletePlanSuccess(planName));
          dispatch(NotificationActions.notify({
            title: formatMessage(messages.planDeletedNotificationTitle),
            message: formatMessage(messages.planDeletedNotificationMessage, { planName: planName }),
            type: 'success'
          }));
          dispatch(CurrentPlanActions.detectPlan());
        }).catch(error => {
          logger.error('Error deleting plan MistralApiService.runAction', error);
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
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      if(payload.status === 'FAILED') {
        dispatch(this.deployPlanFailed(payload.execution.input.container));
        dispatch(NotificationActions.notify({
          title: formatMessage(messages.deploymentFailedNotificationTitle),
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
        MistralConstants.DEPLOYMENT_DEPLOY_PLAN,
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
