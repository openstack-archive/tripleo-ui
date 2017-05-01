import { fromJS, List, Map } from 'immutable';

import { InitialPlanState, Plan, PlanFile } from '../immutableRecords/plans';
import PlansConstants from '../constants/PlansConstants';

const initialState = new InitialPlanState();

export default function plansReducer(state = initialState, action) {
  switch (action.type) {
    case PlansConstants.REQUEST_PLAN:
      return state;

    case PlansConstants.RECEIVE_PLAN: {
      let filesMap = fromJS(action.payload.planFiles).map(
        file => new PlanFile({ name: file.get('name') })
      );
      let newState = state.updateIn(
        ['all', action.payload.planName],
        new Plan({ name: action.payload.planName }),
        plan => plan.set('files', filesMap)
      );
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

    case PlansConstants.DELETE_PLAN_PENDING: {
      return state.setIn(['all', action.payload, 'transition'], 'deleting');
    }

    case PlansConstants.DELETE_PLAN_SUCCESS: {
      return state.set('all', state.get('all').remove(action.payload));
    }

    case PlansConstants.DELETE_PLAN_FAILED: {
      return state.setIn(['all', action.payload, 'transition'], false);
    }

    case PlansConstants.CREATE_PLAN_PENDING:
      return state
        .set('isTransitioningPlan', true)
        .set('planFormErrors', List());

    case PlansConstants.CREATE_PLAN_SUCCESS:
      return state.set('isTransitioningPlan', false);

    case PlansConstants.CREATE_PLAN_FAILED:
      return state
        .set('isTransitioningPlan', false)
        .set('planFormErrors', List(action.payload));

    case PlansConstants.UPDATE_PLAN_PENDING:
      return state
        .setIn(['all', action.payload, 'transition'], 'updating')
        .set('isTransitioningPlan', true);

    case PlansConstants.UPDATE_PLAN_SUCCESS:
      return state
        .setIn(['all', action.payload, 'transition'], false)
        .set('isTransitioningPlan', false);

    case PlansConstants.UPDATE_PLAN_FAILED:
      return state
        .setIn(['all', action.payload, 'transition'], false)
        .set('isTransitioningPlan', false);

    case PlansConstants.START_DEPLOYMENT_PENDING:
      return state.setIn(
        ['all', action.payload, 'isRequestingPlanDeploy'],
        true
      );

    case PlansConstants.START_DEPLOYMENT_SUCCESS:
    case PlansConstants.START_DEPLOYMENT_FAILED:
      return state.setIn(
        ['all', action.payload, 'isRequestingPlanDeploy'],
        false
      );

    case PlansConstants.CANCEL_CREATE_PLAN:
      return state.set('planFormErrors', List());

    case PlansConstants.EXPORT_PLAN_PENDING: {
      return state.set('isExportingPlan', true);
    }

    case PlansConstants.EXPORT_PLAN_SUCCESS: {
      return state
        .set('isExportingPlan', false)
        .set('planExportUrl', action.payload);
    }

    case PlansConstants.EXPORT_PLAN_FAILED: {
      return state.set('isExportingPlan', false);
    }

    default:
      return state;
  }
}
