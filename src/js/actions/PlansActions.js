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
import { normalize } from 'normalizr';
import when from 'when';
import yaml from 'js-yaml';
import { startSubmit, stopSubmit } from 'redux-form';

import { handleErrors } from './ErrorActions';
import history from '../utils/history';
import MistralApiService from '../services/MistralApiService';
import NotificationActions from '../actions/NotificationActions';
import PlansConstants from '../constants/PlansConstants';
import { planFileSchema } from '../normalizrSchemas/plans';
import SwiftApiService from '../services/SwiftApiService';
import MistralConstants from '../constants/MistralConstants';
import { PLAN_ENVIRONMENT } from '../constants/PlansConstants';
import { getServiceUrl } from '../selectors/auth';
import { startWorkflow } from './WorkflowActions';
import { sanitizeMessage } from '../utils';

const messages = defineMessages({
  planCreatedNotificationTitle: {
    id: 'PlansActions.planCreatedNotificationTitle',
    defaultMessage: 'Plan was created'
  },
  planCreatedNotificationMessage: {
    id: 'PlansActions.planCreatedNotificationMessage',
    defaultMessage: 'The plan {planName} was successfully created.'
  },
  planCreationFailed: {
    id: 'PlansActions.planCreationFailedNotificationMessage',
    defaultMessage: 'Plan creation failed'
  },
  planUpdatedNotificationTitle: {
    id: 'PlansActions.planUpdatedNotificationTitle',
    defaultMessage: 'Plan Updated'
  },
  planUpdatedNotificationMessage: {
    id: 'PlansActions.planUpdatedNotificationMessage',
    defaultMessage: 'The plan {planName} was successfully updated.'
  },
  planUpdateFailed: {
    id: 'PlansActions.planUpdateFailedNotificationMessage',
    defaultMessage: 'Plan update failed'
  },
  planDeletedNotificationTitle: {
    id: 'PlansActions.planDeletedNotificationTitle',
    defaultMessage: 'Plan Deleted'
  },
  planDeletedNotificationMessage: {
    id: 'PlansActions.planDeletedNotificationMessage',
    defaultMessage: 'The plan {planName} was successfully deleted.'
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
      return (
        dispatch(MistralApiService.runAction(MistralConstants.PLAN_LIST))
          // TODO(jtomasek): This block should be done on Mistral action side
          .then(planNames =>
            when
              .all(
                planNames.map(name =>
                  dispatch(SwiftApiService.getObject(name, PLAN_ENVIRONMENT))
                )
              )
              .then(planEnvs =>
                planNames.map(planName => {
                  for (let i = 0; i < planEnvs.length; i++) {
                    const { name, description } = yaml.safeLoad(planEnvs[i]);
                    if (name === planName) {
                      return { name, description };
                    }
                  }
                  return { name: planName };
                })
              )
              .catch(error => {
                dispatch(
                  handleErrors(error, 'Plan descriptions could not be loaded')
                );
                return planNames.map(name => ({ name }));
              })
          )
          .then(plans => dispatch(this.receivePlans(plans)))
          .catch(error =>
            dispatch(handleErrors(error, 'Plans could not be loaded'))
          )
      );
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
      return dispatch(SwiftApiService.getContainer(planName))
        .then(response => {
          const planFiles =
            normalize(response, [planFileSchema]).entities.planFiles || {};
          dispatch(this.receivePlan(planName, planFiles));
        })
        .catch(error => {
          dispatch(handleErrors(error, 'Plan could not be loaded'));
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

  updatePlanFailed(planName, errors) {
    return {
      type: PlansConstants.UPDATE_PLAN_FAILED,
      payload: {
        planName,
        errors
      }
    };
  },

  updatePlan(planName, planFiles) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      dispatch(this.updatePlanPending(planName));
      return dispatch(uploadFilesToContainer(planName, planFiles))
        .then(response =>
          dispatch(
            startWorkflow(
              MistralConstants.PLAN_UPDATE,
              {
                container: planName
              },
              execution => dispatch(this.updatePlanFinished(execution)),
              2 * 60 * 1000
            )
          )
        )
        .catch(error => {
          dispatch(handleErrors(error, 'Plan update failed', false));
          dispatch(
            this.updatePlanFailed(planName, [
              {
                title: formatMessage(messages.planUpdateFailed),
                message: error.message
              }
            ])
          );
        });
    };
  },

  updatePlanFromTarball(planName, file) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      dispatch(this.updatePlanPending(planName));
      return dispatch(SwiftApiService.uploadTarball(planName, file))
        .then(response => {
          dispatch(
            startWorkflow(
              MistralConstants.PLAN_UPDATE,
              {
                container: planName
              },
              execution => dispatch(this.updatePlanFinished(execution)),
              2 * 60 * 1000
            )
          );
        })
        .catch(error => {
          dispatch(handleErrors(error, 'Plan update failed', false));
          dispatch(
            this.updatePlanFailed(planName, [
              {
                title: formatMessage(messages.planUpdateFailed),
                message: error.message
              }
            ])
          );
        });
    };
  },

  updatePlanFinished(execution) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      const {
        input: { container: planName },
        output: { message },
        state
      } = execution;
      if (state === 'SUCCESS') {
        dispatch(this.updatePlanSuccess(planName));
        dispatch(
          NotificationActions.notify({
            title: formatMessage(messages.planUpdatedNotificationTitle),
            message: formatMessage(messages.planUpdatedNotificationMessage, {
              planName
            }),
            type: 'success'
          })
        );
        dispatch(this.fetchPlans());
        history.push('/plans/manage');
      } else {
        dispatch(
          this.updatePlanFailed(planName, [
            {
              title: formatMessage(messages.planUpdateFailed),
              message: sanitizeMessage(message)
            }
          ])
        );
      }
    };
  },

  createPlanSuccess(planName) {
    return {
      type: PlansConstants.CREATE_PLAN_SUCCESS,
      payload: planName
    };
  },

  createPlan(planName, planFiles) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      dispatch(startSubmit('newPlanForm'));
      return dispatch(
        MistralApiService.runAction(MistralConstants.CREATE_CONTAINER, {
          container: planName
        })
      )
        .then(response => dispatch(uploadFilesToContainer(planName, planFiles)))
        .then(response =>
          dispatch(
            startWorkflow(
              MistralConstants.PLAN_CREATE,
              {
                container: planName
              },
              execution => dispatch(this.createPlanFinished(execution)),
              2 * 60 * 1000
            )
          )
        )
        .catch(error => {
          dispatch(
            stopSubmit('newPlanForm', {
              _error: {
                title: formatMessage(messages.planCreationFailed),
                message: error.message
              }
            })
          );
        });
    };
  },

  createPlanFromTarball(planName, file) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      dispatch(startSubmit('newPlanForm'));
      dispatch(
        MistralApiService.runAction(MistralConstants.CREATE_CONTAINER, {
          container: planName
        })
      )
        .then(response =>
          dispatch(SwiftApiService.uploadTarball(planName, file))
        )
        .then(response =>
          dispatch(
            startWorkflow(
              MistralConstants.PLAN_CREATE,
              {
                container: planName
              },
              execution => dispatch(this.createPlanFinished(execution)),
              2 * 60 * 1000
            )
          )
        )
        .catch(error => {
          dispatch(
            stopSubmit('newPlanForm', {
              _error: {
                title: formatMessage(messages.planCreationFailed),
                message: error.message
              }
            })
          );
        });
    };
  },

  createPlanFinished(execution) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      const {
        input: { container: planName },
        output: { message },
        state
      } = execution;
      if (state === 'SUCCESS') {
        dispatch(stopSubmit('newPlanForm'));
        dispatch(this.createPlanSuccess(planName));
        dispatch(
          NotificationActions.notify({
            type: 'success',
            title: formatMessage(messages.planCreatedNotificationTitle),
            message: formatMessage(messages.planCreatedNotificationMessage, {
              planName
            })
          })
        );
        dispatch(this.fetchPlans());
        history.push('/plans/manage');
      } else {
        dispatch(
          stopSubmit('newPlanForm', {
            _error: {
              title: formatMessage(messages.planCreationFailed),
              message: sanitizeMessage(message)
            }
          })
        );
      }
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
      history.push('/plans/manage');
      return dispatch(
        MistralApiService.runAction(MistralConstants.PLAN_DELETE, {
          container: planName
        })
      )
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
          dispatch(
            handleErrors(error, `Plan ${planName} could not be deleted`)
          );
          dispatch(this.deletePlanFailed(planName));
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

  exportPlan(planName) {
    return dispatch => {
      dispatch(this.exportPlanPending(planName));
      dispatch(
        startWorkflow(
          MistralConstants.PLAN_EXPORT,
          {
            plan: planName
          },
          execution => dispatch(this.exportPlanFinished(execution))
        )
      ).catch(error => {
        dispatch(handleErrors(error, `Plan ${planName} could not be exported`));
        dispatch(this.exportPlanFailed(planName));
      });
    };
  },

  exportPlanFinished(execution) {
    return (dispatch, getState, { getIntl }) => {
      const { formatMessage } = getIntl(getState());
      const {
        input: { plan },
        output: { message, tempurl },
        state
      } = execution;
      if (state === 'ERROR' || !tempurl) {
        dispatch(this.exportPlanFailed(plan));
        dispatch(
          NotificationActions.notify({
            title: formatMessage(messages.exportFailedNotificationTitle),
            message: sanitizeMessage(message)
          })
        );
      } else {
        let urlParser = document.createElement('a');
        urlParser.href = tempurl;
        let url = urlParser.hostname;
        urlParser.href = getServiceUrl(getState(), 'swift');
        let swiftUrl = urlParser.hostname;
        dispatch(this.exportPlanSuccess(tempurl.replace(url, swiftUrl)));
      }
    };
  }
};

/*
  * Uploads a number of files to a container.
  * Returns a promise which gets resolved when all files are uploaded
  * or rejected if >= 1 objects fail.
  * @container: String
  * @files: Object
  */
export const uploadFilesToContainer = (container, files) => dispatch =>
  when.all(
    Object.keys(files).map(fileName =>
      dispatch(
        SwiftApiService.createObject(container, fileName, files[fileName])
      )
    )
  );
