import { fromJS, Map } from 'immutable';

import ValidationsConstants from '../constants/ValidationsConstants';
import { Validation, ValidationResult, ValidationStage } from '../immutableRecords/validations';

const initialState = Map({
  loaded: false,
  isFetching: false,
  validationStages: Map(),
  validations: Map(),
  validationResults: Map()
});

export default function validationsReducer(state = initialState, action) {
  switch(action.type) {

  case ValidationsConstants.FETCH_VALIDATION_STAGES_PENDING: {
    return state.set('isFetching', true);
  }

  case ValidationsConstants.FETCH_VALIDATION_STAGES_SUCCESS: {
    const { validationStages, validations, validationResults } = action.payload.entities;

    return state.set('validationStages', validationStages ? fromJS(validationStages)
                  .map(stage => new ValidationStage(stage)) : Map())
                .set('validations', validations ? fromJS(validations)
                  .map(validation => new Validation(validation)) : Map())
                .set('validationResults', validationResults ? fromJS(validationResults)
                  .map(result => new ValidationResult(result)) : Map())
                .set('isFetching', false)
                .set('loaded', true);

  }

  case ValidationsConstants.FETCH_VALIDATION_STAGES_FAILED:
    return state.set('isFetching', false)
                .set('loaded', true);

  case ValidationsConstants.UPDATE_STAGE_STATUS: {
    return state.setIn(['validationStages', action.payload.uuid, 'status'],
                          action.payload.status);
  }

  case ValidationsConstants.UPDATE_VALIDATION_STATUS: {
    return state.setIn(['validations', action.payload.uuid, 'status'], action.payload.status);
  }

  default:
    return state;

  }
}
