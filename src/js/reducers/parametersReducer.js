import { fromJS, List, Map } from 'immutable';

import ParametersConstants from '../constants/ParametersConstants';
import { ParametersDefaultState } from '../immutableRecords/parameters';

const initialState = new ParametersDefaultState();

export default function parametersReducer(state = initialState, action) {
  switch(action.type) {

  case ParametersConstants.FETCH_PARAMETERS_PENDING:
    return state
            .set('isPending', true)
            .set('form', Map({ formErrors: List(), formFieldErrors: Map() }));

  case ParametersConstants.FETCH_PARAMETERS_SUCCESS: {
    const { resourceTree, mistralParameters } = action.payload;
    return state
            .set('isPending', false)
            .set('form', Map({
              formErrors: List(),
              formFieldErrors: Map()
            }))
            .set('resourceTree', fromJS(resourceTree) || Map())
            .set('mistralParameters', fromJS(mistralParameters) || Map());
  }

  case ParametersConstants.FETCH_PARAMETERS_FAILED:
    return state
            .set('isPending', false)
            .set('form', Map({
              formErrors: List(),
              formFieldErrors: Map()
            }));

  case ParametersConstants.UPDATE_PARAMETERS_PENDING:
    return state.set('isPending', true);

  case ParametersConstants.UPDATE_PARAMETERS_SUCCESS:
    return state
            .set('isPending', false)
            .set('form', Map({
              formErrors: List(),
              formFieldErrors: Map()
            }));

  case ParametersConstants.UPDATE_PARAMETERS_FAILED:
    return state
            .set('isPending', false)
            .set('form', Map({
              formErrors: List.of(...action.payload.formErrors),
              formFieldErrors: Map(action.payload.formFieldErrors)
            }));

  default:
    return state;

  }
}
