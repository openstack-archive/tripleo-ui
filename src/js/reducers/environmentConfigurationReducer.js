import { fromJS, Map } from 'immutable';

import EnvironmentConfigurationConstants
  from '../constants/EnvironmentConfigurationConstants';
import {
  EnvironmentConfigurationState,
  Environment
} from '../immutableRecords/environmentConfiguration';
import PlansConstants from '../constants/PlansConstants';

const initialState = new EnvironmentConfigurationState();

export default function environmentConfigurationReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_CONFIGURATION_PENDING:
      return state.set('isFetching', true);

    case EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_CONFIGURATION_SUCCESS: {
      const topics = action.payload.topics || Map();
      const environmentGroups = action.payload.environmentGroups || Map();
      const environments = action.payload.environments || Map();
      return state
        .set('isFetching', false)
        .set('loaded', true)
        .set('topics', fromJS(topics))
        .set('environmentGroups', fromJS(environmentGroups))
        .set('environments', fromJS(environments).map(e => new Environment(e)));
    }

    case EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_CONFIGURATION_FAILED:
      return state.set('isFetching', false).set('loaded', true);

    case EnvironmentConfigurationConstants.UPDATE_ENVIRONMENT_CONFIGURATION_PENDING:
      return state.set('isFetching', true);

    case EnvironmentConfigurationConstants.UPDATE_ENVIRONMENT_CONFIGURATION_SUCCESS: {
      const enabledEnvs = fromJS(action.payload);
      const updatedEnvs = state.environments.map(environment => {
        return environment.set(
          'enabled',
          enabledEnvs.includes(environment.get('file'))
        );
      });
      return state.set('environments', updatedEnvs).set('isFetching', false);
    }

    case EnvironmentConfigurationConstants.UPDATE_ENVIRONMENT_CONFIGURATION_FAILED:
      return state
        .set('isFetching', false)
        .set('loaded', true)
        .set('form', fromJS(action.payload));

    case EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_PENDING:
      return state.setIn(['environments', action.payload, 'isFetching'], true);

    case EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_SUCCESS: {
      const { file, resourceRegistry, parameterDefaults } = action.payload;
      return state.updateIn(['environments', file], environment =>
        environment
          .set('resourceRegistry', fromJS(resourceRegistry || {}))
          .set('parameterDefaults', fromJS(parameterDefaults || {}))
          .set('isFetching', false)
      );
    }

    case EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_FAILED:
      return state.updateIn(
        ['environments', action.payload.environmentPath],
        e => e.set('error', action.payload.error).set('isFetching', false)
      );

    case PlansConstants.PLAN_CHOSEN:
      return initialState;

    default:
      return state;
  }
}
