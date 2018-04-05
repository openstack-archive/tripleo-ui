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
  GET_DEPLOYMENT_STATUS_SUCCESS
} from '../constants/DeploymentConstants';
import { handleErrors } from './ErrorActions';
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
  dispatch(
    SwiftApiService.getObject(`${planName}-messages`, 'plan_status.yaml')
  )
    .then(response => {
      const { workflow_status } = yaml.safeLoad(response);
      dispatch(getDeploymentStatusSuccess(planName, workflow_status));
    })
    .catch(error => {
      // If object is not found, deployment status is undefined
      if (error.name === 'SwiftApiError' && error.response.status === 404) {
        dispatch(getDeploymentStatusSuccess(planName, undefined));
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
