import { fromJS, Map, List } from 'immutable';

import ValidationsConstants from '../constants/ValidationsConstants';
import { Validation, ValidationResult, ValidationStage } from '../immutableRecords/validations';

const initialState = Map({
  validationsLoaded: false,
  isFetching: false,
  validationStages: Map(),
  validations: Map(),
  validationResults: Map()
});

export default function validationsReducer(state = initialState, action) {
  switch(action.type) {

  case ValidationsConstants.FETCH_VALIDATIONS_PENDING: {
    return state.set('isFetching', true);
  }

  // case ValidationsConstants.FETCH_VALIDATION_STAGES_SUCCESS: {
  //   const validations = fromJS(action.payload.entities.validations) || Map();
  //   const validationStages = fromJS(action.payload.entities.validationStages) || Map();
  //   const validationResults = fromJS(action.payload.entities.validationResults) || Map();
  //
  //   return state.set('validationStages', validationStages
  //                 .map(stage => new ValidationStage(stage.set('visible',
  //                   state.getIn(['validationStages', stage.uuid, 'visible'], false)))))
  //               .set('validations', validations
  //                 .map(validation => new Validation(validation)))
  //               .set('validationResults', validationResults
  //                 .map(result => new ValidationResult(result)))
  //               .set('isFetching', false)
  //               .set('validationsLoaded', true);
  // }
  case ValidationsConstants.FETCH_VALIDATIONS_SUCCESS: {
    const validations = fromJS(action.payload);

    return state.set('validations', validations.map( validation => new Validation(validation)))
                .set('isFetching', false)
                .set('validationsLoaded', true);
  }

  case ValidationsConstants.FETCH_VALIDATIONS_FAILED:
    return state.set('isFetching', false)
                .set('validationsLoaded', true);

  case ValidationsConstants.UPDATE_STAGE_STATUS: {
    let validationIds = state.getIn(
      ['validationStages', action.payload.uuid, 'validations'],
      List([]));

    let validations = state.get('validations');

    let updatedValidations = validationIds.reduce((r, validationId) => {
      return r.setIn([validationId, 'status'], action.payload.status);
    }, validations);

    return state.setIn(['validationStages', action.payload.uuid, 'status'], action.payload.status)
                .set('validations', updatedValidations);
  }

  case ValidationsConstants.UPDATE_VALIDATION_STATUS: {
    return state.setIn(['validations', action.payload.uuid, 'status'], action.payload.status);
  }

  case ValidationsConstants.TOGGLE_VALIDATION_STAGE_VISIBILITY: {
    return state.updateIn(['validationStages', action.payload.uuid, 'visible'],
                          (oldValue) => !oldValue);
  }

  case ValidationsConstants.SHOW_VALIDATION_STAGE: {
    return state.setIn(['validationStages', action.payload.uuid, 'visible'], true);
  }

  default:
    return state;

  }
}
