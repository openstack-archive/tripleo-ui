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

import { createSelector } from 'reselect';

import { getCurrentPlanName } from './plans';
import MistralConstants from '../constants/MistralConstants';
import { DeploymentStatusUI } from '../immutableRecords/deploymentStatus';
import { deploymentStates as ds } from '../constants/DeploymentConstants';

const deploymentStatusByPlan = state =>
  state.deploymentStatus.deploymentStatusByPlan;
const getDeploymentStatusUIByPlan = state =>
  state.deploymentStatus.deploymentStatusUI;

export const getDeploymentStatusByPlan = createSelector(
  deploymentStatusByPlan,
  planDeploymentStates =>
    planDeploymentStates.map(({ status, type, message }) => {
      switch (status) {
        case 'RUNNING':
          if (type === MistralConstants.DEPLOYMENT_DEPLOY_PLAN) {
            return { status: ds.DEPLOYING, message };
          } else if (type === MistralConstants.UNDEPLOY_PLAN) {
            return { status: ds.UNDEPLOYING, message };
          }
        case 'FAILED':
        case 'ERROR':
          if (type === MistralConstants.DEPLOYMENT_DEPLOY_PLAN) {
            return { status: ds.DEPLOYMENT_FAILED, message };
          } else if (type === MistralConstants.UNDEPLOY_PLAN) {
            return { status: ds.UNDEPLOY_FAILED, message };
          }
        case 'SUCCESS':
          if (type === MistralConstants.DEPLOYMENT_DEPLOY_PLAN) {
            return { status: ds.DEPLOYED, message };
          } else if (type === MistralConstants.UNDEPLOY_PLAN) {
            return { status: ds.UNDEPLOYED, message };
          }
        case 'UNKNOWN':
          return { status: ds.UNKNOWN };
        default:
          return { status: ds.UNDEPLOYED };
      }
    })
);

export const getCurrentPlanDeploymentStatus = createSelector(
  [getCurrentPlanName, getDeploymentStatusByPlan],
  (currentPlanName, planDeploymentStates) =>
    planDeploymentStates.get(currentPlanName, {})
);

export const getCurrentPlanDeploymentStatusUI = createSelector(
  [getCurrentPlanName, getDeploymentStatusUIByPlan],
  (currentPlanName, planDeploymentUIStates) =>
    planDeploymentUIStates.get(currentPlanName, new DeploymentStatusUI())
);
