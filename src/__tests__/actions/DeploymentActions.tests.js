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

import * as DeploymentActions from '../../js/actions/DeploymentActions';
import * as WorkflowActions from '../../js/actions/WorkflowActions';
import SwiftApiService from '../../js/services/SwiftApiService';
import { mockStore } from './utils';

describe('getDeploymentStatus', () => {
  it('dispatches expected actions on success', () => {
    const mockResponse = {
      workflow_status: {
        type: 'tripleo.v1.deploy_plan',
        payload: {
          deployment_status: 'DEPLOY_SUCCESS',
          message: 'Deployment Succeeded'
        }
      }
    };
    yaml.safeLoad = jest.fn(input => input);
    SwiftApiService.getObject = jest
      .fn()
      .mockReturnValue(() => Promise.resolve(mockResponse));
    const store = mockStore({});

    return store
      .dispatch(DeploymentActions.getDeploymentStatus('overcloud'))
      .then(() => {
        expect(SwiftApiService.getObject).toHaveBeenCalledWith(
          'overcloud-messages',
          'deployment_status.yaml'
        );
        expect(store.getActions()).toEqual([
          DeploymentActions.getDeploymentStatusPending('overcloud'),
          DeploymentActions.getDeploymentStatusSuccess('overcloud', {
            message: 'Deployment Succeeded',
            status: 'DEPLOY_SUCCESS',
            type: 'tripleo.v1.deploy_plan'
          })
        ]);
      });
  });

  it('dispatches expected actions on error', () => {
    const error = { message: 'Something went wrong' };
    SwiftApiService.getObject = jest
      .fn()
      .mockReturnValue(() => Promise.reject(error));
    const store = mockStore({});

    return store
      .dispatch(DeploymentActions.getDeploymentStatus('overcloud'))
      .then(() => {
        expect(SwiftApiService.getObject).toHaveBeenCalledWith(
          'overcloud-messages',
          'deployment_status.yaml'
        );
        const actions = store.getActions();
        expect(actions.map(a => a.type)).toEqual([
          'GET_DEPLOYMENT_STATUS_PENDING',
          'NOTIFY',
          'GET_DEPLOYMENT_STATUS_FAILED'
        ]);
        expect(actions[2]).toEqual(
          DeploymentActions.getDeploymentStatusFailed(
            'overcloud',
            error.message
          )
        );
      });
  });
});

describe('startDeployment', () => {
  it('dispatches expected actions on success', () => {
    const store = mockStore({});
    WorkflowActions.startWorkflow = jest
      .fn()
      .mockReturnValue(() => Promise.resolve());

    return store
      .dispatch(DeploymentActions.startDeployment('overcloud'))
      .then(() => {
        expect(WorkflowActions.startWorkflow).toHaveBeenCalled();
        expect(store.getActions()).toEqual([
          DeploymentActions.startDeploymentPending('overcloud'),
          DeploymentActions.startDeploymentSuccess('overcloud')
        ]);
      });
  });

  it('dispatches expected actions on error', () => {
    const store = mockStore({});
    const error = { message: 'Something went wrong' };
    WorkflowActions.startWorkflow = jest
      .fn()
      .mockReturnValue(() => Promise.reject(error));

    return store
      .dispatch(DeploymentActions.startDeployment('overcloud'))
      .then(() => {
        const actions = store.getActions();
        expect(actions.map(a => a.type)).toEqual([
          'START_DEPLOYMENT_PENDING',
          'NOTIFY',
          'START_DEPLOYMENT_FAILED'
        ]);
        expect(actions[2]).toEqual(
          DeploymentActions.startDeploymentFailed('overcloud', error.message)
        );
      });
  });
});
