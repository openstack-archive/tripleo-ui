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

import { Map } from 'immutable';

import { getCurrentStackDeploymentInProgress,
         getCurrentStack } from '../../js/selectors/stacks';
import { CurrentPlanState } from '../../js/immutableRecords/currentPlan';
import { Stack, StacksState } from '../../js/immutableRecords/stacks';

describe('stacks selectors', () => {
  describe('getCurrentStack()', () => {
    const state = {
      stacks: new StacksState({
        stacks: Map({
          overcloud: Stack({ stack_name: 'overcloud', stack_status: 'CREATE_COMPLETE' }),
          anothercloud: Stack({ stack_name: 'anothercloud', stack_status: 'CREATE_FAILED' })
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
    it('returns true if the current plan\'s deployment is in progress', () => {
      const state = {
        stacks: new StacksState({
          stacks: Map({
            overcloud: Stack({ stack_name: 'overcloud', stack_status: 'CREATE_IN_PROGRESS' }),
            anothercloud: Stack({ stack_name: 'anothercloud', stack_status: 'CREATE_FAILED' })
          })
        }),
        currentPlan: new CurrentPlanState({
          currentPlanName: 'overcloud'
        })
      };
      expect(getCurrentStackDeploymentInProgress(state)).toBe(true);
    });

    it('returns false if the current plan\'s deployment is not in progress', () => {
      const state = {
        stacks: new StacksState({
          stacks: Map({
            overcloud: Stack({ stack_name: 'overcloud', stack_status: 'CREATE_FAILED' }),
            anothercloud: Stack({ stack_name: 'anothercloud', stack_status: 'CREATE_IN_PROGRESS' })
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
            anothercloud: Stack({ stack_name: 'anothercloud', stack_status: 'CREATE_IN_PROGRESS' })
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
