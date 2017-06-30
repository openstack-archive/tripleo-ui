/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { defineMessages } from 'react-intl';
import { fromJS } from 'immutable';
import { normalize, arrayOf } from 'normalizr';
import when from 'when';
import yaml from 'js-yaml';

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
import { getAppConfig } from '../services/utils';

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
  },
  exportFailedNotificationTitle: {
    id: 'PlansActions.exportFailedNotificationTitle',
    defaultMessage: 'Export Failed'
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
      MistralApiService.runAction(MistralConstants.PLAN_LIST)
        .then(response => {
          let names = JSON.parse(response.output).result;
          let plans = [];
          let plan_envs = names.map(name => {
            return SwiftApiService.getObject(name, 'plan-environment.yaml');
          });
          when.all(plan_envs)
            .then(responses => {
              responses.map(response => {
                let response_obj = yaml.safeLoad(response.responseText);
                plans.push({
                  name: response_obj.name,
                  description: response_obj.description
                })
              })
            })
            .then(() => {
              dispatch(this.receivePlans(plans));
            });
        })
        .catch(error => {
          logger.error(
            'Error in PlansActions.fetchPlans',
            error.stack || error
          );
          let errorHandler = new MistralApiErrorHandler(error);
          errorHandler.errors.forEach(error => {
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
      SwiftApiService.getContainer(planName)
        .then(response => {
          dispatch(
            this.receivePlan(
              planName,
              normalize(response, arrayOf(planFileSchema)).entities.planFiles
            )
          );
        })
        .catch(error => {
          logger.error(
            'Error retrieving plan PlansActions.fetchPlan',
            error.stack || error
          );
          let errorHandler = new SwiftApiErrorHandler(error);
          errorHandler.errors.forEach(error => {
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

  updatePlan(planName, planFiles, history) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      dispatch(this.updatePlanPending(planName));
      this._uploadFilesToContainer(planName, fromJS(planFiles), dispatch)
        .then(() => {
          dispatch(this.updatePlanSuccess(planName));
          history.push('/plans/manage');
          dispatch(
            NotificationActions.notify({
              title: formatMessage(messages.planUpdatedNotificationTitle),
              message: formatMessage(messages.planUpdatedNotificationMessage, {
                planName: planName
              }),
              type: 'success'
            })
          );
          dispatch(this.fetchPlans());
        })
        .catch(errors => {
          logger.error('Error in PlansActions.updatePlan', errors);
          errors.forEach(error => {
            dispatch(NotificationActions.notify(error));
          });
          dispatch(this.updatePlanFailed(planName));
        });
    };
  },

  updatePlanFromTarball(planName, file, history) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      dispatch(this.updatePlanPending(planName));
      SwiftApiService.uploadTarball(planName, file)
        .then(response => {
          dispatch(this.updatePlanSuccess(planName));
          history.push('/plans/manage');
          dispatch(
            NotificationActions.notify({
              title: formatMessage(messages.planUpdatedNotificationTitle),
              message: formatMessage(messages.planUpdatedNotificationMessage, {
                planName: planName
              }),
              type: 'success'
            })
          );
          dispatch(this.fetchPlans());
        })
        .catch(error => {
          logger.error('Error in PlansActions.updatePlanFromTarball', error);
          let errorHandler = new SwiftApiErrorHandler(error);
          errorHandler.errors.forEach(error => {
            dispatch(NotificationActions.notify(error));
          });
          dispatch(this.updatePlanFailed(planName));
        });
    };
  },

  cancelCreatePlan() {
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
        SwiftApiService.createObject(container, key, value.get('contents'))
          .then(response => {
            // On success increase nr of uploaded files.
            // If this is the last file in the map, resolve the promise.
            if (uploadedFiles === files.size - 1) {
              resolve();
            }
            uploadedFiles += 1;
          })
          .catch(error => {
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
      })
        .then(response => {
          // Upload all files to container first.
          this._uploadFilesToContainer(planName, fromJS(planFiles), dispatch)
            .then(() => {
              // Once all files are uploaded, start plan creation workflow.
              MistralApiService.runWorkflow(MistralConstants.PLAN_CREATE, {
                container: planName
              })
                .then(response => {
                  if (response.state === 'ERROR') {
                    logger.error('Error in PlansActions.createPlan', response);
                    dispatch(
                      NotificationActions.notify({
                        title: 'Error',
                        message: response.state_info
                      })
                    );
                    dispatch(this.createPlanFailed());
                  }
                })
                .catch(error => {
                  logger.error('Error in PlansActions.createPlan', error);
                  let errorHandler = new MistralApiErrorHandler(error);
                  errorHandler.errors.forEach(error => {
                    dispatch(NotificationActions.notify(error));
                  });
                  dispatch(this.createPlanFailed());
                });
            })
            .catch(errors => {
              logger.error('Error in PlansActions.createPlan', errors);
              // If the file upload fails, just notify the user
              errors.forEach(error => {
                dispatch(NotificationActions.notify(error));
              });
              dispatch(this.createPlanFailed());
            });
        })
        .catch(error => {
          logger.error('Error in PlansActions.createPlan', error);
          let errorHandler = new MistralApiErrorHandler(error);
          errorHandler.errors.forEach(error => {
            dispatch(NotificationActions.notify(error));
          });
          dispatch(this.createPlanFailed());
        });
    };
  },

  createPlanFinished(payload, history) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      if (payload.status === 'SUCCESS') {
        const planName = payload.execution.input.container;
        dispatch(this.createPlanSuccess());
        dispatch(
          NotificationActions.notify({
            type: 'success',
            title: formatMessage(messages.planCreatedNotificationTitle),
            message: formatMessage(messages.planCreatedNotificationMessage, {
              planName: planName
            })
          })
        );
        dispatch(this.fetchPlans());
        history.push('/plans/manage');
      } else {
        dispatch(
          this.createPlanFailed([{ title: 'Error', message: payload.message }])
        );
      }
    };
  },

  createPlanFromTarball(planName, file) {
    return dispatch => {
      dispatch(this.createPlanPending());

      MistralApiService.runAction(MistralConstants.CREATE_CONTAINER, {
        container: planName
      })
        .then(response => {
          SwiftApiService.uploadTarball(planName, file)
            .then(response => {
              MistralApiService.runWorkflow(MistralConstants.PLAN_CREATE, {
                container: planName
              })
                .then(response => {
                  if (response.state === 'ERROR') {
                    logger.error(
                      'Error in PlansActions.createPlanFromTarball',
                      response
                    );
                    dispatch(
                      this.createPlanFailed([
                        { title: 'Error', message: response.state_info }
                      ])
                    );
                  }
                })
                .catch(error => {
                  logger.error(
                    'Error in workflow in PlansActions.createPlanFromTarball',
                    error
                  );
                  let errorHandler = new MistralApiErrorHandler(error);
                  dispatch(this.createPlanFailed(errorHandler.errors));
                });
            })
            .catch(error => {
              logger.error(
                'Error in Swift in PlansActions.createPlanFromTarball',
                error
              );
              let errorHandler = new SwiftApiErrorHandler(error);
              dispatch(this.createPlanFailed(errorHandler.errors));
            });
        })
        .catch(error => {
          logger.error('Error in PlansActions.createPlan', error);
          let errorHandler = new MistralApiErrorHandler(error);
          errorHandler.errors.forEach(error => {
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

  deletePlan(planName, history) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      dispatch(this.deletePlanPending(planName));
      history.push('/plans/manage');
      MistralApiService.runAction(MistralConstants.PLAN_DELETE, {
        container: planName
      })
        .then(response => {
          dispatch(this.deletePlanSuccess(planName));
          dispatch(
            NotificationActions.notify({
              title: formatMessage(messages.planDeletedNotificationTitle),
              message: formatMessage(messages.planDeletedNotificationMessage, {
                planName: planName
              }),
              type: 'success'
            })
          );
        })
        .catch(error => {
          logger.error(
            'Error deleting plan MistralApiService.runAction',
            error
          );
          dispatch(this.deletePlanFailed(planName));
          let errorHandler = new MistralApiErrorHandler(error);
          errorHandler.errors.forEach(error => {
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
      if (payload.status === 'FAILED') {
        dispatch(this.deployPlanFailed(payload.execution.input.container));
        dispatch(
          NotificationActions.notify({
            title: formatMessage(messages.deploymentFailedNotificationTitle),
            message: payload.message,
            type: 'error'
          })
        );
      } else {
        dispatch(this.deployPlanSuccess(payload.execution.input.container));
        dispatch(StackActions.fetchStacks());
      }
    };
  },

  deployPlan(planName) {
    return dispatch => {
      dispatch(this.deployPlanPending(planName));
      MistralApiService.runWorkflow(MistralConstants.DEPLOYMENT_DEPLOY_PLAN, {
        container: planName,
        timeout: 240
      })
        .then(response => {
          dispatch(StackActions.fetchStacks());
        })
        .catch(error => {
          dispatch(this.deployPlanFailed(planName));
          let errorHandler = new MistralApiErrorHandler(error);
          errorHandler.errors.forEach(error => {
            dispatch(NotificationActions.notify(error));
          });
        });
    };
  },

  exportPlanPending(planName) {
    return {
      type: PlansConstants.EXPORT_PLAN_PENDING,
      payload: planName
    };
  },

  exportPlanSuccess(planExportUrl) {
    return {
      type: PlansConstants.EXPORT_PLAN_SUCCESS,
      payload: planExportUrl
    };
  },

  exportPlanFailed(planName) {
    return {
      type: PlansConstants.EXPORT_PLAN_FAILED,
      payload: planName
    };
  },

  exportPlanFinished(payload) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      if (payload.status === 'FAILED' || !payload.tempurl) {
        dispatch(this.exportPlanFailed(payload.execution.input.plan));
        dispatch(
          NotificationActions.notify({
            title: formatMessage(messages.exportFailedNotificationTitle),
            message: payload.message,
            type: 'error'
          })
        );
      } else {
        let urlParser = document.createElement('a');
        urlParser.href = payload.tempurl;
        let url = urlParser.hostname;
        urlParser.href = getAppConfig().swift;
        let swiftUrl = urlParser.hostname;
        dispatch(
          this.exportPlanSuccess(payload.tempurl.replace(url, swiftUrl))
        );
      }
    };
  },

  exportPlan(planName) {
    return dispatch => {
      dispatch(this.exportPlanPending(planName));
      MistralApiService.runWorkflow(MistralConstants.PLAN_EXPORT, {
        plan: planName
      })
        .then(response => {
          if (response.state === 'ERROR') {
            logger.error('Error in PlansActions.exportPlan', response);
            dispatch(this.exportPlanFailed(planName));
          }
        })
        .catch(error => {
          logger.error('Error in PlansActions.exportPlan', error);
          dispatch(this.exportPlanFailed(planName));
          let errorHandler = new MistralApiErrorHandler(error);
          errorHandler.errors.forEach(error => {
            dispatch(NotificationActions.notify(error));
          });
        });
    };
  }
};
