/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { fromJS, Map } from 'immutable';

import EnvironmentConfigurationConstants from '../constants/EnvironmentConfigurationConstants';
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

    case EnvironmentConfigurationConstants.UPDATE_ENVIRONMENT_CONFIGURATION_SUCCESS: {
      const enabledEnvs = fromJS(action.payload);
      const updatedEnvs = state.environments.map(environment =>
        environment.set(
          'enabled',
          enabledEnvs.includes(environment.get('file'))
        )
      );
      return state.set('environments', updatedEnvs);
    }

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
