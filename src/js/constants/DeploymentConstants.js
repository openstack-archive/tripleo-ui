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

import keyMirror from 'keymirror';
import { defineMessages } from 'react-intl';

export const GET_DEPLOYMENT_STATUS_FAILED = 'GET_DEPLOYMENT_STATUS_FAILED';
export const GET_DEPLOYMENT_STATUS_SUCCESS = 'GET_DEPLOYMENT_STATUS_SUCCESS';
export const GET_DEPLOYMENT_STATUS_PENDING = 'GET_DEPLOYMENT_STATUS_PENDING';
export const START_DEPLOYMENT_FAILED = 'START_DEPLOYMENT_FAILED';
export const START_DEPLOYMENT_SUCCESS = 'START_DEPLOYMENT_SUCCESS';
export const START_DEPLOYMENT_PENDING = 'START_DEPLOYMENT_PENDING';
export const DEPLOYMENT_FAILED = 'DEPLOYMENT_FAILED';
export const DEPLOYMENT_SUCCESS = 'DEPLOYMENT_SUCCESS';

export const deploymentStates = keyMirror({
  UNDEPLOYED: null,
  DEPLOY_SUCCESS: null,
  STARTING_DEPLOYMENT: null,
  DEPLOYING: null,
  UNDEPLOYING: null,
  DEPLOY_FAILED: null,
  UNDEPLOY_FAILED: null,
  UNKNOWN: null
});

export const deploymentStatusMessages = defineMessages({
  UNDEPLOYED: {
    id: 'DeploymentStatus.undeployed',
    defaultMessage: 'Deployment not started'
  },
  DEPLOY_SUCCESS: {
    id: 'DeploymentStatus.deployed',
    defaultMessage: 'Deployment succeeded'
  },
  DEPLOYING: {
    id: 'DeploymentStatus.deploying',
    defaultMessage: 'Deployment in progress'
  },
  UNDEPLOYING: {
    id: 'DeploymentStatus.undeploying',
    defaultMessage: 'Undeploy in progress'
  },
  DEPLOY_FAILED: {
    id: 'DeploymentStatus.deploymentFailed',
    defaultMessage: 'Deployment failed'
  },
  UNDEPLOY_FAILED: {
    id: 'DeploymentStatus.undeployFailed',
    defaultMessage: 'Undeploy failed'
  },
  UNKNOWN: {
    id: 'DeploymentStatus.unknown',
    defaultMessage: 'Plan {planName} deployment status could not be loaded'
  }
});
