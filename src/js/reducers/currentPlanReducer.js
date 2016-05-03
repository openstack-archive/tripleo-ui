import { CurrentPlanState } from '../immutableRecords/currentPlan';
import PlansConstants from '../constants/PlansConstants';

const initialState = new CurrentPlanState;

export default function currentPlanReducer(state = initialState, action) {
  switch(action.type) {

  case PlansConstants.PLAN_CHOSEN:
    return state.set('currentPlanName', action.payload);

  case PlansConstants.PLAN_DETECTED:
    return state
            .set('currentPlanName', action.payload.currentPlanName)
            .set('conflict', action.payload.conflict);

  default:
    return state;

  }
}
