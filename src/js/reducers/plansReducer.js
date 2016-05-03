import { Map } from 'immutable';

import { InitialPlanState,
         Plan,
         PlanFile } from '../immutableRecords/plans';
import PlansConstants from '../constants/PlansConstants';

const initialState = new InitialPlanState;

export default function plansReducer(state = initialState, action) {
  switch(action.type) {

  case PlansConstants.REQUEST_PLAN:
    return state;

  case PlansConstants.RECEIVE_PLAN: {
    let filesMap = action.payload.files
      ? filesMap = Map(action.payload.files)
                      .map((item, key) => new PlanFile({
                        name: key,
                        contents: item.contents,
                        meta: item.meta
                      }))
      : Map();
    let newState = state
            .updateIn(
              ['all', action.payload.name],
              new Plan({ name: action.payload.name }),
              plan => plan.set('files', filesMap));
    return newState;
  }

  case PlansConstants.REQUEST_PLANS:
    return state.set('isFetchingPlans', true);

  case PlansConstants.RECEIVE_PLANS: {
    let planData = {};
    action.payload.result.forEach(name => {
      planData[name] = new Plan(action.payload.entities.plan[name]);
    });
    return state
            .set('isFetchingPlans', false)
            .set('all', Map(planData));
  }

  case PlansConstants.DELETING_PLAN: {
    return state.setIn(['all', action.payload, 'transition'], 'deleting');
  }

  case PlansConstants.PLAN_DELETED: {
    return state.setIn(['all', action.payload, 'transition'], false);
  }

  case PlansConstants.CREATING_PLAN:
    return state
            .set('isCreatingPlan', true);

  case PlansConstants.PLAN_CREATED:
    return state
            .set('isCreatingPlan', false);

  case PlansConstants.UPDATING_PLAN:
    return state
            .set('transition', 'updating');

  case PlansConstants.PLAN_UPDATED:
    return state
            .set('transition', false);

  default:
    return state;

  }
}
