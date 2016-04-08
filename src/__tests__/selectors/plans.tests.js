import { Map } from 'immutable';
import matchers from 'jasmine-immutable-matchers';

import { Plan } from '../../js/immutableRecords/plans';
import { getAllPlansButCurrent, getCurrentStack } from '../../js/selectors/plans';
import { InitialPlanState, Stack } from '../../js/immutableRecords/plans';

describe('plans selectors', () => {
  beforeEach(() => {
    jasmine.addMatchers(matchers);
  });

  describe('getAllPlansButCurrent()', () => {
    const state = {
      plans: InitialPlanState({
        isFetchingPlans: false,
        conflict: undefined,
        currentPlanName: 'plan1',
        all: Map({
          plan1: new Plan({
            name: 'plan1',
            transition: false,
            files: Map()
          }),
          plan2: new Plan({
            name: 'plan2',
            transition: false,
            files: Map()
          })
        })
      })
    };

    it('provides selector to list all Plans except for the currently selected one', () => {
      expect(getAllPlansButCurrent(state).size).toEqual(1);
      expect(getAllPlansButCurrent(state).first().name).toEqual('plan2');
    });
  });

  describe('getCurrentStack()', () => {
    const state = {
      plans: InitialPlanState({
        currentPlanName: 'overcloud',
        stacks: Map({
          overcloud: Stack({ stack_name: 'overcloud', stack_status: 'CREATE_COMPLETE' }),
          anothercloud: Stack({ stack_name: 'anothercloud', stack_status: 'CREATE_FAILED' })
        })
      })
    };

    it('returns a stack based on the currentPlanName', () => {
      expect(getCurrentStack(state)).toEqualImmutable(
         Stack({ stack_name: 'overcloud', stack_status: 'CREATE_COMPLETE' })
      );
    });
  });
});
