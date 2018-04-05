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

import { combineReducers } from 'redux';
import { fromJS, Map } from 'immutable';

import {
  DeploymentStatus,
  DeploymentStatusUI
} from '../immutableRecords/deploymentStatus';
import {
  GET_DEPLOYMENT_STATUS_PENDING,
  GET_DEPLOYMENT_STATUS_FAILED,
  GET_DEPLOYMENT_STATUS_SUCCESS
} from '../constants/DeploymentConstants';

export const deploymentStatusByPlan = (state = Map(), { type, payload }) => {
  switch (type) {
    case GET_DEPLOYMENT_STATUS_FAILED:
      return state.set(
        payload.planName,
        new DeploymentStatus({ status: 'UNKNOWN' })
      );
    case GET_DEPLOYMENT_STATUS_SUCCESS:
      return state.set(
        payload.planName,
        new DeploymentStatus(fromJS(payload.deploymentStatus))
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
