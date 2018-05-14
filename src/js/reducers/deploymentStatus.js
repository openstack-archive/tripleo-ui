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

import { Map, List } from 'immutable';
import { combineReducers } from 'redux';

import {
  CONFIG_DOWNLOAD_MESSAGE,
  DEPLOYMENT_FAILED,
  DEPLOYMENT_SUCCESS,
  GET_DEPLOYMENT_STATUS_FAILED,
  GET_DEPLOYMENT_STATUS_PENDING,
  GET_DEPLOYMENT_STATUS_SUCCESS,
  START_DEPLOYMENT_FAILED,
  START_DEPLOYMENT_PENDING,
  START_DEPLOYMENT_SUCCESS,
  deploymentStates
} from '../constants/DeploymentConstants';
import {
  DeploymentStatus,
  DeploymentStatusUI
} from '../immutableRecords/deploymentStatus';

export const deploymentStatusByPlan = (state = Map(), { type, payload }) => {
  switch (type) {
    case GET_DEPLOYMENT_STATUS_FAILED:
      return state.set(
        payload.planName,
        new DeploymentStatus({ status: deploymentStates.UNKNOWN })
      );
    case GET_DEPLOYMENT_STATUS_SUCCESS:
      return state.update(payload.planName, new DeploymentStatus(), status =>
        status.merge(Map(payload.deploymentStatus))
      );
    case CONFIG_DOWNLOAD_MESSAGE:
      return state.update(payload.planName, new DeploymentStatus(), status =>
        status.update('configDownloadMessages', List(), messages =>
          messages.push(payload.message)
        )
      );
    case START_DEPLOYMENT_PENDING:
      return state.set(
        payload,
        new DeploymentStatus({ status: deploymentStates.STARTING_DEPLOYMENT })
      );
    case START_DEPLOYMENT_SUCCESS:
      return state.set(
        payload,
        new DeploymentStatus({ status: deploymentStates.DEPLOYING })
      );
    case START_DEPLOYMENT_FAILED:
      return state.set(
        payload.planName,
        new DeploymentStatus({
          status: deploymentStates.UNDEPLOYED,
          message: payload.message
        })
      );
    case DEPLOYMENT_SUCCESS:
      return state.set(
        payload.planName,
        new DeploymentStatus({
          status: deploymentStates.DEPLOY_SUCCESS,
          message: payload.message
        })
      );
    case DEPLOYMENT_FAILED:
      return state.set(
        payload.planName,
        new DeploymentStatus({
          status: deploymentStates.DEPLOY_FAILED,
          message: payload.message
        })
      );
    default:
      return state;
  }
};

export const deploymentStatusUI = (state = Map(), { type, payload }) => {
  switch (type) {
    case GET_DEPLOYMENT_STATUS_PENDING:
      return state.setIn([payload, 'isFetching'], true);
    case GET_DEPLOYMENT_STATUS_FAILED:
      return state.set(
        payload.planName,
        new DeploymentStatusUI({
          isLoaded: true,
          isFetching: false,
          error: payload.error
        })
      );
    case GET_DEPLOYMENT_STATUS_SUCCESS:
      return state.set(
        payload.planName,
        new DeploymentStatusUI({
          isLoaded: true,
          isFetching: false,
          error: undefined
        })
      );
    default:
      return state;
  }
};

const deploymentStatus = combineReducers({
  deploymentStatusByPlan,
  deploymentStatusUI
});

export default deploymentStatus;
