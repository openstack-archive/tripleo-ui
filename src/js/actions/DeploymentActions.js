/**
 * Copyright 2018 Red Hat Inc.
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

import yaml from 'js-yaml';

import {
  GET_DEPLOYMENT_STATUS_FAILED,
  GET_DEPLOYMENT_STATUS_PENDING,
  GET_DEPLOYMENT_STATUS_SUCCESS,
  START_DEPLOYMENT_FAILED,
  START_DEPLOYMENT_PENDING,
  START_DEPLOYMENT_SUCCESS,
  DEPLOYMENT_FAILED,
  DEPLOYMENT_SUCCESS
} from '../constants/DeploymentConstants';
import { handleErrors } from './ErrorActions';
import MistralConstants from '../constants/MistralConstants';
import { startWorkflow } from './WorkflowActions';
import SwiftApiService from '../services/SwiftApiService';

export const getDeploymentStatusPending = planName => ({
  type: GET_DEPLOYMENT_STATUS_PENDING,
  payload: planName
});

export const getDeploymentStatusSuccess = (planName, deploymentStatus) => ({
  type: GET_DEPLOYMENT_STATUS_SUCCESS,
  payload: { planName, deploymentStatus }
});

export const getDeploymentStatusFailed = (planName, error) => ({
  type: GET_DEPLOYMENT_STATUS_FAILED,
  payload: { planName, error }
});

export const getDeploymentStatus = planName => dispatch => {
  dispatch(getDeploymentStatusPending(planName));
  return dispatch(
    SwiftApiService.getObject(`${planName}-messages`, 'deployment_status.yaml')
  )
    .then(response => {
      const {
        workflow_status: {
          type,
          payload: { deployment_status: status, message }
        }
      } = yaml.safeLoad(response);
      dispatch(getDeploymentStatusSuccess(planName, { status, message, type }));
    })
    .catch(error => {
      if (error.name === 'SwiftApiError' && error.response.status === 404) {
        dispatch(getDeploymentStatusSuccess(planName));
      } else {
        dispatch(
          handleErrors(
            error,
            `Plan ${planName} deployment status could not be loaded`
          )
        );
        dispatch(getDeploymentStatusFailed(planName, error.message));
      }
    });
};

export const startDeploymentPending = planName => ({
  type: START_DEPLOYMENT_PENDING,
  payload: planName
});

export const startDeploymentSuccess = planName => ({
  type: START_DEPLOYMENT_SUCCESS,
  payload: planName
});

export const startDeploymentFailed = (planName, message) => ({
  type: START_DEPLOYMENT_FAILED,
  payload: { planName, message }
});

export const startDeployment = planName => dispatch => {
  dispatch(startDeploymentPending(planName));
  return dispatch(
    startWorkflow(
      MistralConstants.DEPLOYMENT_DEPLOY_PLAN,
      {
        container: planName,
        timeout: 240,
        config_download: true
      },
      execution => dispatch(deploymentFinished(execution)),
      90 * 60 * 1000
    )
  )
    .then(execution => dispatch(startDeploymentSuccess(planName)))
    .catch(error => {
      dispatch(handleErrors(error, `Plan ${planName} could not be deployed`));
      dispatch(startDeploymentFailed(planName, error.message));
    });
};

export const deploymentSuccess = (planName, message) => ({
  type: DEPLOYMENT_SUCCESS,
  payload: { planName, message }
});

export const deploymentFailed = (planName, message) => ({
  type: DEPLOYMENT_FAILED,
  payload: { planName, message }
});

export const deploymentFinished = execution => (
  dispatch,
  getState,
  { getIntl }
) => {
  const {
    input: { container: planName },
    output: { message },
    state
  } = execution;
  if (state === 'ERROR') {
    dispatch(deploymentFailed(planName, message));
  } else {
    dispatch(deploymentSuccess(planName, message));
  }
};
