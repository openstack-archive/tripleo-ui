import { fromJS, Map } from 'immutable';

import ValidationsConstants from '../constants/ValidationsConstants';
import { Validation } from '../immutableRecords/validations';

const initialState = Map({
  validationsLoaded: false,
  isFetching: false,
  validations: Map()
});

export default function validationsReducer(state = initialState, action) {
  switch (action.type) {
    case ValidationsConstants.FETCH_VALIDATIONS_PENDING: {
      return state.set('isFetching', true);
    }

    case ValidationsConstants.FETCH_VALIDATIONS_SUCCESS: {
      const validations = fromJS(action.payload);

      return state
        .set(
          'validations',
          validations.map(validation => new Validation(validation))
        )
        .set('isFetching', false)
        .set('validationsLoaded', true);
    }

    case ValidationsConstants.FETCH_VALIDATIONS_FAILED:
      return state.set('isFetching', false).set('validationsLoaded', true);

    default:
      return state;
  }
}
