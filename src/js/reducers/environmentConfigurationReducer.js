import { fromJS, Map } from 'immutable';

import EnvironmentConfigurationConstants from '../constants/EnvironmentConfigurationConstants';
import { EnvironmentConfigurationState } from '../immutableRecords/environmentConfiguration';
import PlansConstants from '../constants/PlansConstants';

const initialState = new EnvironmentConfigurationState;

export default function environmentConfigurationReducer(state = initialState, action) {
  switch(action.type) {

  case EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_CONFIGURATION_PENDING:
    return initialState.set('isFetching', true);

  case EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_CONFIGURATION_SUCCESS: {
    const topics = action.payload.topics || Map();
    const environmentGroups = action.payload.environmentGroups || Map();
    const environments = action.payload.environments || Map();
    return state
        .set('isFetching', false)
        .set('loaded', true)
        .set('topics', fromJS(topics))
        .set('environmentGroups', fromJS(environmentGroups))
        .set('environments', fromJS(environments));
  }

  case EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_CONFIGURATION_FAILED:
    return initialState.set('isFetching', false)
                       .set('loaded', true);

  case EnvironmentConfigurationConstants.UPDATE_ENVIRONMENT_CONFIGURATION_PENDING:
    return state.set('isFetching', true);

  case EnvironmentConfigurationConstants.UPDATE_ENVIRONMENT_CONFIGURATION_SUCCESS: {
    const enabledEnvs = fromJS(action.payload);
    const updatedEnvs = state.environments.map(environment => {
      return environment.set('enabled', enabledEnvs.includes(environment.get('file')));
    });
    return state.set('environments', updatedEnvs)
                .set('isFetching', false);
  }

  case EnvironmentConfigurationConstants.UPDATE_ENVIRONMENT_CONFIGURATION_FAILED:
    return state
        .set('isFetching', false)
        .set('loaded', true)
        .set('form', fromJS(action.payload));

  case PlansConstants.PLAN_CHOSEN:
    return state.set('loaded', false);

  default:
    return state;

  }
}
