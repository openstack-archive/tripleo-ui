import NotificationActions from '../actions/NotificationActions';
import PlansConstants from '../constants/PlansConstants';

export default {
  detectPlan(plans) {
    return (dispatch, getState) => {
      let state = getState();
      let plans = state.plans.get('all').map(plan => plan.get('name'));
      let conflict;
      let currentPlanName = state.currentPlan.get('currentPlanName');
      let previousPlan = currentPlanName || getStoredPlan();
      // No plans present.
      if(plans.size < 1 ) {
        if(!previousPlan) {
          currentPlanName = undefined;
        }
      }
      // Plans present.
      // No previously chosen plan.
      else if(!previousPlan) {
        currentPlanName = plans.first();
      }
      // Previously chosen plan doesn't exist any more.
      else if(!plans.includes(previousPlan)) {
        conflict = previousPlan;
        currentPlanName = plans.first();
      }
      // No plan in state, but in localStorage
      else if(!currentPlanName && previousPlan) {
        currentPlanName = previousPlan;
      }
      storePlan(currentPlanName);
      dispatch(this.planDetected(currentPlanName, conflict));
    };
  },

  planDetected(currentPlanName, conflict) {
    return {
      type: PlansConstants.PLAN_DETECTED,
      payload: {
        currentPlanName: currentPlanName,
        conflict: conflict
      }
    };
  },

  choosePlan(planName) {
    return dispatch => {
      dispatch(NotificationActions.notify({
        title: 'Plan Activated',
        message: 'The plan ' + planName + ' was activated.',
        type: 'success'
      }));
      storePlan(planName);
      dispatch(this.planChosen(planName));
    };
  },

  planChosen(planName) {
    return {
      type: PlansConstants.PLAN_CHOSEN,
      payload: planName
    };
  }
};

function storePlan(name) {
  if(window && window.localStorage) {
    if(!name) {
      window.localStorage.removeItem('currentPlanName');
    }
    else {
      window.localStorage.setItem('currentPlanName', name);
    }
  }
}

function getStoredPlan() {
  if(window && window.localStorage) {
    return window.localStorage.getItem('currentPlanName');
  }
  return null;
}
