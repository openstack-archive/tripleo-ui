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

import configureMockStore from 'redux-mock-store';
import { startSubmit, stopSubmit } from 'redux-form';
import thunkMiddleware from 'redux-thunk';

import EnvironmentConfigurationActions from '../../js/actions/EnvironmentConfigurationActions';
import NotificationActions from '../../js/actions/NotificationActions';
import MistralApiService from '../../js/services/MistralApiService';
import { mockGetIntl } from './utils';

const mockStore = configureMockStore([
  thunkMiddleware.withExtraArgument(mockGetIntl)
]);

describe('fetchEnvironmentConfiguration', () => {
  const store = mockStore({});

  it('dispatches fetchEnvironmentConfigurationSuccess', () => {
    const response = {
      'General Deployment Options': {
        environment_groups: [
          {
            description:
              'Enable basic configuration required for OpenStack Deployment',
            environments: [
              {
                enabled: true,
                description: null,
                file: 'overcloud-resource-registry-puppet.yaml',
                title: 'Default Configuration'
              }
            ],
            title: null
          }
        ],
        description: null,
        title: 'General Deployment Options'
      }
    };
    const normalizedResponse = {
      environmentGroups: {
        'Enable basic configuration required for OpenStack Deployment': {
          description:
            'Enable basic configuration required for OpenStack Deployment',
          environments: ['overcloud-resource-registry-puppet.yaml'],
          title: null
        }
      },
      environments: {
        'overcloud-resource-registry-puppet.yaml': {
          description: null,
          enabled: true,
          file: 'overcloud-resource-registry-puppet.yaml',
          title: 'Default Configuration'
        }
      },
      topics: {
        'General Deployment Options': {
          description: null,
          environment_groups: [
            'Enable basic configuration required for OpenStack Deployment'
          ],
          title: 'General Deployment Options'
        }
      }
    };
    MistralApiService.runAction = jest
      .fn()
      .mockReturnValue(() => Promise.resolve(response));
    return store
      .dispatch(
        EnvironmentConfigurationActions.fetchEnvironmentConfiguration('myPlan')
      )
      .then(() => {
        expect(MistralApiService.runAction).toHaveBeenCalled();
        expect(store.getActions()).toEqual([
          EnvironmentConfigurationActions.fetchEnvironmentConfigurationPending(),
          EnvironmentConfigurationActions.fetchEnvironmentConfigurationSuccess(
            normalizedResponse
          )
        ]);
      });
  });
});

describe('updateEnvironmentConfiguration', () => {
  const store = mockStore({});

  beforeEach(() => {
    MistralApiService.runAction = jest.fn().mockReturnValue(() =>
      Promise.resolve({
        template: 'overcloud.yaml',
        environments: [
          {
            path: 'overcloud-resource-registry-puppet.yaml'
          },
          {
            path: 'environments/puppet-pacemaker.yaml'
          },
          {
            path: 'environments/network-isolation.yaml'
          }
        ]
      })
    );
    NotificationActions.notify = jest.fn(() => ({ type: 'NOTIFY' }));
  });

  it('dispatches actions', () => {
    return store
      .dispatch(
        EnvironmentConfigurationActions.updateEnvironmentConfiguration('myPlan')
      )
      .then(() => {
        expect(MistralApiService.runAction).toHaveBeenCalled();
        expect(store.getActions()).toEqual([
          startSubmit('environmentConfigurationForm'),
          EnvironmentConfigurationActions.updateEnvironmentConfigurationSuccess(
            [
              'overcloud-resource-registry-puppet.yaml',
              'environments/puppet-pacemaker.yaml',
              'environments/network-isolation.yaml'
            ]
          ),
          stopSubmit('environmentConfigurationForm'),
          NotificationActions.notify({ type: 'NOTIFY' })
        ]);
      });
  });
});
