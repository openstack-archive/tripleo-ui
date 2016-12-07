import { Map } from 'immutable';
import matchers from 'jasmine-immutable-matchers';

import { getCurrentStackDeploymentInProgress,
         getCurrentStack,
         getOvercloudInfo } from '../../js/selectors/stacks';
import { CurrentPlanState } from '../../js/immutableRecords/currentPlan';
import { Stack, StacksState } from '../../js/immutableRecords/stacks';

describe('stacks selectors', () => {
  beforeEach(() => {
    jasmine.addMatchers(matchers);
  });

  describe('getOvercloudInfo', () => {
    let state;
    beforeEach(() => {
      state = {
        stacks: new StacksState({
          resources: Map(),
          stacks: Map({
            overcloud: Stack({
              stack_name: 'overcloud',
              environment: Map()
            }),
            anothercloud: Stack({ stack_name: 'anothercloud' })
          })
        }),
        currentPlan: new CurrentPlanState({
          currentPlanName: 'overcloud'
        })
      };
    });

    it('returns false if ip and admin pwd are not loaded', () => {
      expect(getOvercloudInfo(state)).toBe(false);
    });

    it('returns false if ip is not loaded', () => {
      state.stacks = state.stacks.setIn(['stacks', 'overcloud', 'environment'], Map({
        parameter_defaults: Map({ AdminPassword: '12345' })
      }));
      expect(getOvercloudInfo(state)).toBe(false);
    });

    it('returns false if admin pwd is not loaded', () => {
      state.stacks = state.stacks.setIn(
        ['resources', 'PublicVirtualIP', 'attributes', 'ip_address'],
        '192.0.2.5'
      );
      expect(getOvercloudInfo(state)).toBe(false);
    });

    it('returns a Map containing ip and pwd if both are loaded', () => {
      state.stacks = state.stacks.setIn(['stacks', 'overcloud', 'environment'], Map({
        parameter_defaults: Map({ AdminPassword: '12345' })
      }));
      state.stacks = state.stacks.setIn(
        ['resources', 'PublicVirtualIP', 'attributes', 'ip_address'],
        '192.0.2.5'
      );
      expect(getOvercloudInfo(state)).toEqual(Map({
        ipAddress: '192.0.2.5',
        adminPassword: '12345'
      }));
    });
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
