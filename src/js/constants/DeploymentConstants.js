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

import keyMirror from 'keyMirror';
import { defineMessages } from 'react-intl';

export const GET_DEPLOYMENT_STATUS_FAILED = 'GET_DEPLOYMENT_STATUS_FAILED';
export const GET_DEPLOYMENT_STATUS_SUCCESS = 'GET_DEPLOYMENT_STATUS_SUCCESS';
export const GET_DEPLOYMENT_STATUS_PENDING = 'GET_DEPLOYMENT_STATUS_PENDING';

export const deploymentStates = keyMirror({
  UNDEPLOYED: null,
  DEPLOYED: null,
  DEPLOYING: null,
  UNDEPLOYING: null,
  DEPLOYMENT_FAILED: null,
  UNDEPLOY_FAILED: null
});

export const deploymentStatusMessages = defineMessages({
  UNDEPLOYED: {
    id: 'DeploymentStatus.undeployed',
    defaultMessage: 'Deployment is not deployed yet'
  },
  DEPLOYED: {
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
  DEPLOYMENT_FAILED: {
    id: 'DeploymentStatus.deploymentFailed',
    defaultMessage: 'Deployment failed'
  },
  UNDEPLOY_FAILED: {
    id: 'DeploymentStatus.undeployFailed',
    defaultMessage: 'Undeploy failed'
  }
});
