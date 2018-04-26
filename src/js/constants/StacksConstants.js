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

import keyMirror from 'keymirror';
import { defineMessages } from 'react-intl';

export default keyMirror({
  DELETE_STACK_PENDING: null,
  DELETE_STACK_FAILED: null,
  DELETE_STACK_SUCCESS: null,
  FETCH_STACK_ENVIRONMENT_SUCCESS: null,
  FETCH_STACK_ENVIRONMENT_PENDING: null,
  FETCH_STACK_ENVIRONMENT_FAILED: null,
  FETCH_RESOURCE_SUCCESS: null,
  FETCH_RESOURCE_PENDING: null,
  FETCH_RESOURCE_FAILED: null,
  FETCH_RESOURCES_PENDING: null,
  FETCH_RESOURCES_SUCCESS: null,
  FETCH_RESOURCES_FAILED: null,
  FETCH_STACKS_PENDING: null,
  FETCH_STACKS_SUCCESS: null,
  FETCH_STACKS_FAILED: null,
  FETCH_STACK_SUCCESS: null
});

export const stackStates = keyMirror({
  CREATE_IN_PROGRESS: null,
  CREATE_COMPLETE: null,
  CREATE_FAILED: null,
  DELETE_COMPLETE: null,
  DELETE_IN_PROGRESS: null,
  DELETE_FAILED: null,
  UPDATE_IN_PROGRESS: null,
  UPDATE_FAILED: null,
  UPDATE_COMPLETE: null
});

export const deploymentStatusMessages = defineMessages({
  CREATE_IN_PROGRESS: {
    id: 'DeploymentStatus.createInProgress',
    defaultMessage: 'Deployment in progress'
  },
  CREATE_COMPLETE: {
    id: 'DeploymentStatus.createComplete',
    defaultMessage: 'Deployment succeeded'
  },
  CREATE_FAILED: {
    id: 'DeploymentStatus.createFailed',
    defaultMessage: 'Deployment failed'
  },
  DELETE_IN_PROGRESS: {
    id: 'Deploy.deleteInProgress',
    defaultMessage: 'Deletion in progress'
  },
  DELETE_FAILED: {
    id: 'DeploymentStatus.deleteFailed',
    defaultMessage: 'Deployment deletion failed'
  },
  UPDATE_IN_PROGRESS: {
    id: 'DeploymentStatus.updateInProgress',
    defaultMessage: 'Update in progress'
  },
  UPDATE_FAILED: {
    id: 'DeploymentStatus.updateFailed',
    defaultMessage: 'Update failed'
  },
  UPDATE_COMPLETE: {
    id: 'DeploymentStatus.updateComplete',
    defaultMessage: 'Update succeeded'
  }
});
