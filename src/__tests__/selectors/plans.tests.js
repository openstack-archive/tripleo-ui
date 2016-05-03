import { Map } from 'immutable';
import matchers from 'jasmine-immutable-matchers';

import { Plan } from '../../js/immutableRecords/plans';
import { getAllPlansButCurrent } from '../../js/selectors/plans';
import { InitialPlanState } from '../../js/immutableRecords/plans';
import { CurrentPlanState } from '../../js/immutableRecords/currentPlan';

describe('plans selectors', () => {
  beforeEach(() => {
    jasmine.addMatchers(matchers);
  });

  describe('getAllPlansButCurrent()', () => {
    const state = {
      plans: new InitialPlanState({
        isFetchingPlans: false,
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
      }),
      currentPlan: new CurrentPlanState({
        conflict: undefined,
        currentPlanName: 'plan1'
      })
    };

    it('provides selector to list all Plans except for the currently selected one', () => {
      expect(getAllPlansButCurrent(state).size).toEqual(1);
      expect(getAllPlansButCurrent(state).first().name).toEqual('plan2');
    });
  });
});
