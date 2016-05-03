import matchers from 'jasmine-immutable-matchers';

import { CurrentPlanState } from '../../js/immutableRecords/currentPlan';
import currentPlanReducer from '../../js/reducers/currentPlanReducer';
import CurrentPlanActions from '../../js/actions/CurrentPlanActions';


describe('plansReducer state', () => {

  beforeEach(() => {
    jasmine.addMatchers(matchers);
  });

  describe('default state', () => {
    let state;

    beforeEach(() => {
      state = currentPlanReducer(undefined, {type: 'undefined-action'});
    });

    it('`conflict` is undefined', () => {
      expect(state.get('conflict')).not.toBeDefined();
    });

    it('`currentPlanName` is undefined', () => {
      expect(state.get('currentPlanName')).not.toBeDefined();
    });
  });

  describe('PLAN_CHOSEN', () => {
    let state;

    beforeEach(() => {
      state = currentPlanReducer(new CurrentPlanState(),
                                 CurrentPlanActions.planChosen('another-cloud'));
    });

    it('sets the current planName', () => {
      expect(state.get('currentPlanName')).toEqual('another-cloud');
    });
  });
});
