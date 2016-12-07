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

import { fromJS, Map } from 'immutable';

import {
  getCurrentStackDeploymentInProgress,
  getCurrentStack,
  getOvercloudInfo
} from '../../js/selectors/stacks';
import { CurrentPlanState } from '../../js/immutableRecords/currentPlan';
import { Stack, StacksState } from '../../js/immutableRecords/stacks';

describe('stacks selectors', () => {
  describe('getOvercloudInfo', () => {
    let state;
    beforeEach(() => {
      state = {
        stacks: new StacksState({
          resources: Map(),
          resourceDetails: Map(),
          stacks: Map({
            overcloud: Stack({
              stack_name: 'overcloud',
              environment: Map()
            }),
            anothercloud: Stack({ stack_name: 'anothercloud' })
          })
        }),
        currentStackEnvironment: Map(),
        currentPlan: new CurrentPlanState({
          currentPlanName: 'overcloud'
        })
      };
    });

    it('returns false if ip and admin pwd are not loaded', () => {
      expect(getOvercloudInfo(state)).toEqual(
        Map({
          ipAddress: undefined,
          adminPassword: undefined
        })
      );
    });

    it('returns false if ip is not loaded', () => {
      state.stacks = state.stacks.set(
        'currentStackEnvironment',
        fromJS({
          parameter_defaults: { AdminPassword: '12345' }
        })
      );
      expect(getOvercloudInfo(state)).toEqual(
        Map({
          ipAddress: undefined,
          adminPassword: '12345'
        })
      );
    });

    it('returns empty Map if admin pwd is not loaded', () => {
      state.stacks = state.stacks.setIn(
        ['resourceDetails', 'PublicVirtualIP', 'attributes', 'ip_address'],
        '192.0.2.5'
      );
      expect(getOvercloudInfo(state)).toEqual(
        Map({
          ipAddress: '192.0.2.5',
          adminPassword: undefined
        })
      );
    });

    it('returns a Map containing ip and pwd if both are loaded', () => {
      state.stacks = state.stacks.set(
        'currentStackEnvironment',
        fromJS({
          parameter_defaults: { AdminPassword: 'overcloudAdminPass' }
        })
      );
      state.stacks = state.stacks.setIn(
        ['resourceDetails', 'PublicVirtualIP', 'attributes', 'ip_address'],
        '192.0.2.5'
      );
      expect(getOvercloudInfo(state)).toEqual(
        Map({
          ipAddress: '192.0.2.5',
          adminPassword: 'overcloudAdminPass'
        })
      );
    });
  });

  describe('getCurrentStack()', () => {
    const state = {
      stacks: new StacksState({
        stacks: Map({
          overcloud: Stack({
            stack_name: 'overcloud',
            stack_status: 'CREATE_COMPLETE'
          }),
          anothercloud: Stack({
            stack_name: 'anothercloud',
            stack_status: 'CREATE_FAILED'
          })
        })
      }),
      currentPlan: new CurrentPlanState({
        currentPlanName: 'overcloud'
      })
    };

    it('returns a stack based on the currentPlanName', () => {
      expect(getCurrentStack(state)).toEqual(
        Stack({ stack_name: 'overcloud', stack_status: 'CREATE_COMPLETE' })
      );
    });
  });

  describe('getCurrentStackDeploymentInProgress', () => {
    it("returns true if the current plan's deployment is in progress", () => {
      const state = {
        stacks: new StacksState({
          stacks: Map({
            overcloud: Stack({
              stack_name: 'overcloud',
              stack_status: 'CREATE_IN_PROGRESS'
            }),
            anothercloud: Stack({
              stack_name: 'anothercloud',
              stack_status: 'CREATE_FAILED'
            })
          })
        }),
        currentPlan: new CurrentPlanState({
          currentPlanName: 'overcloud'
        })
      };
      expect(getCurrentStackDeploymentInProgress(state)).toBe(true);
    });

    it("returns false if the current plan's deployment is not in progress", () => {
      const state = {
        stacks: new StacksState({
          stacks: Map({
            overcloud: Stack({
              stack_name: 'overcloud',
              stack_status: 'CREATE_FAILED'
            }),
            anothercloud: Stack({
              stack_name: 'anothercloud',
              stack_status: 'CREATE_IN_PROGRESS'
            })
          })
        }),
        currentPlan: new CurrentPlanState({
          currentplanname: 'overcloud'
        })
      };
      expect(getCurrentStackDeploymentInProgress(state)).toBe(false);
    });

    it('returns false if the current plan does not have an associated stack', () => {
      const state = {
        stacks: new StacksState({
          stacks: Map({
            anothercloud: Stack({
              stack_name: 'anothercloud',
              stack_status: 'CREATE_IN_PROGRESS'
            })
          })
        }),
        currentPlan: new CurrentPlanState({
          currentplanname: 'overcloud'
        })
      };
      expect(getCurrentStackDeploymentInProgress(state)).toBe(false);
    });
  });
});
