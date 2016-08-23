import { List, Map } from 'immutable';

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
    action.payload.forEach(name => {
      planData[name] = new Plan({ name: name });
    });
    return state
            .set('isFetchingPlans', false)
            .set('plansLoaded', true)
            .set('all', Map(planData));
  }

  case PlansConstants.DELETING_PLAN: {
    return state.setIn(['all', action.payload, 'transition'], 'deleting');
  }

  case PlansConstants.PLAN_DELETED: {
    return state.setIn(['all', action.payload, 'transition'], false);
  }

  case PlansConstants.CREATE_PLAN_PENDING:
    return state
            .set('isCreatingPlan', true)
            .set('planFormErrors', List());

  case PlansConstants.CREATE_PLAN_SUCCESS:
    return state
            .set('isCreatingPlan', false);

  case PlansConstants.CREATE_PLAN_FAILED:
    return state
            .set('isCreatingPlan', false)
            .set('planFormErrors', List(action.payload));

  case PlansConstants.UPDATING_PLAN:
    return state.setIn(['all', action.payload, 'transition'], 'updating');

  case PlansConstants.PLAN_UPDATED:
    return state.setIn(['all', action.payload, 'transition'], false);

  case PlansConstants.START_DEPLOYMENT_PENDING:
    return state.setIn(['all', action.payload, 'isRequestingPlanDeploy'], true);

  case PlansConstants.START_DEPLOYMENT_SUCCESS:
  case PlansConstants.START_DEPLOYMENT_FAILED:
    return state.setIn(['all', action.payload.planName, 'isRequestingPlanDeploy'], false);

  case PlansConstants.CANCEL_CREATE_PLAN:
    return state.set('planFormErrors', List());

  default:
    return state;

  }
}
