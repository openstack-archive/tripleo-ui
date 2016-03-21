import { Map } from 'immutable';
import matchers from 'jasmine-immutable-matchers';

import * as selectors from '../../js/selectors/plans';
import { Plan } from '../../js/immutableRecords/plans';

describe('Plans selectors', () => {
  beforeEach(() => {
    jasmine.addMatchers(matchers);
  });

  const state = {
    plans: Map({
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
    expect(selectors.getAllPlansButCurrent(state).size).toEqual(1);
    expect(selectors.getAllPlansButCurrent(state).first().name).toEqual('plan2');
  });
});
