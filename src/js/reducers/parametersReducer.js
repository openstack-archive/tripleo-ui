import { fromJS, List, Map } from 'immutable';

import EnvironmentConfigurationConstants
  from '../constants/EnvironmentConfigurationConstants';
import ParametersConstants from '../constants/ParametersConstants';
import PlansConstants from '../constants/PlansConstants';
import {
  ParametersDefaultState,
  Resource,
  Parameter
} from '../immutableRecords/parameters';

const initialState = new ParametersDefaultState();

export default function parametersReducer(state = initialState, action) {
  switch (action.type) {
    case ParametersConstants.FETCH_PARAMETERS_PENDING:
      return state
        .set('isFetching', true)
        .set('form', Map({ formErrors: List(), formFieldErrors: Map() }));

    case ParametersConstants.FETCH_PARAMETERS_SUCCESS: {
      const { resources, parameters, mistralParameters } = action.payload;
      return state
        .set('loaded', true)
        .set('isFetching', false)
        .set(
          'form',
          Map({
            formErrors: List(),
            formFieldErrors: Map()
          })
        )
        .set(
          'resources',
          fromJS(resources).map(resource => new Resource(resource))
        )
        .set(
          'parameters',
          Map(parameters).map(parameter => new Parameter(parameter))
        )
        .set('mistralParameters', fromJS(mistralParameters) || Map());
    }

    case ParametersConstants.FETCH_PARAMETERS_FAILED:
      return state.set('loaded', true).set('isFetching', false).set(
        'form',
        Map({
          formErrors: List(),
          formFieldErrors: Map()
        })
      );

    case ParametersConstants.UPDATE_PARAMETERS_PENDING:
      return state.set('isFetching', true);

    case ParametersConstants.UPDATE_PARAMETERS_SUCCESS: {
      const updatedParameters = action.payload;
      return state
        .set('isFetching', false)
        .set(
          'form',
          Map({
            formErrors: List(),
            formFieldErrors: Map()
          })
        )
        .update('parameters', parameters => {
          return parameters.map(
            parameter =>
              Object.keys(updatedParameters).includes(parameter.name)
                ? parameter.set('default', updatedParameters[parameter.name])
                : parameter
          );
        });
    }

    case ParametersConstants.UPDATE_PARAMETERS_FAILED:
      return state.set('isFetching', false).set(
        'form',
        Map({
          formErrors: List.of(...action.payload.formErrors),
          formFieldErrors: Map(action.payload.formFieldErrors)
        })
      );

    case EnvironmentConfigurationConstants.UPDATE_ENVIRONMENT_CONFIGURATION_SUCCESS:
      return state.set('loaded', false);

    case PlansConstants.PLAN_CHOSEN:
      return initialState;

    default:
      return state;
  }
}
