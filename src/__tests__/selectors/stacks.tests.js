import { Map } from 'immutable';
import matchers from 'jasmine-immutable-matchers';

import { getCurrentStackDeploymentProgress,
         getCurrentStack } from '../../js/selectors/stacks';
import { CurrentPlanState } from '../../js/immutableRecords/currentPlan';
import { Stack, StacksState } from '../../js/immutableRecords/stacks';

describe('stacks selectors', () => {
  beforeEach(() => {
    jasmine.addMatchers(matchers);
  });

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
      expect(getCurrentStack(state)).toEqualImmutable(
         Stack({ stack_name: 'overcloud', stack_status: 'CREATE_COMPLETE' })
      );
    });
  });

  describe('getCurrentStackDeploymentProgress', () => {
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
      expect(getCurrentStackDeploymentProgress(state)).toBe(true);
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
      expect(getCurrentStackDeploymentProgress(state)).toBe(false);
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
      expect(getCurrentStackDeploymentProgress(state)).toBe(false);
    });
  });
});
