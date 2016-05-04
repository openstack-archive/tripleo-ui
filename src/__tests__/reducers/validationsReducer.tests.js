import matchers from 'jasmine-immutable-matchers';
import { List, Map } from 'immutable';

import { Validation,
         ValidationStage,
         ValidationResult } from '../../js/immutableRecords/validations';
import ValidationsConstants from '../../js/constants/ValidationsConstants';
import validationsReducer from '../../js/reducers/validationsReducer';

describe('validationsReducer', () => {
  beforeEach(() => {
    jasmine.addMatchers(matchers);
  });

  const initialState = Map({
    isFetching: false,
    validationStages: Map(),
    validations: Map(),
    validationResults: Map()
  });

  const updatedState = Map({
    isFetching: false,
    validationStages:  Map({
      1: new ValidationStage({
        description: '',
        name: 'testStage',
        visible: false,
        stage: '',
        status: 'new',
        uuid: 1,
        validations: List([1])
      })
    }),
    validations: Map({
      1: new Validation({
        description: '',
        latest_result: undefined,
        name: 'testValidation',
        status: 'running',
        results: List([1]),
        uuid: 1
      })
    }),
    validationResults: Map({
      1: new ValidationResult({
        date: undefined,
        detailed_description: Map(),
        status: undefined,
        uuid: 1
      })
    })
  });

  it('should return initial state', () => {
    expect(validationsReducer(initialState, {})).toEqual(initialState);
  });

  it('should handle FETCH_VALIDATION_STAGES_PENDING', () => {
    const action = {
      type: ValidationsConstants.FETCH_VALIDATION_STAGES_PENDING
    };
    const newState = validationsReducer(initialState, action);
    expect(newState.get('isFetching')).toEqual(true);
  });

  it('should handle FETCH_VALIDATION_STAGES_SUCCESS', () => {
    const action = {
      type: ValidationsConstants.FETCH_VALIDATION_STAGES_SUCCESS,
      payload: {
        entities: {
          validationStages: {
            1: {
              name: 'testStage',
              visible: false,
              uuid: 1,
              status: 'new',
              validations: [1]
            }
          },
          validations: {
            1: {
              name: 'testValidation',
              uuid: 1,
              status: 'running',
              results: [1]
            }
          },
          validationResults: {
            1: {
              uuid: 1
            }
          }
        }
      }
    };
    const newState = validationsReducer(initialState, action);
    expect(newState.get('validationStages')).toEqualImmutable(
      updatedState.get('validationStages')
    );
    expect(newState.get('validations')).toEqualImmutable(
      updatedState.get('validations')
    );
    expect(newState.get('validationResults')).toEqualImmutable(
      updatedState.get('validationResults')
    );
  });

  it('should handle UPDATE_STAGE_STATUS', () => {
    const action = {
      type: ValidationsConstants.UPDATE_STAGE_STATUS,
      payload: {
        uuid: 1,
        status: 'failed'
      }
    };
    const newState = validationsReducer(updatedState, action);
    expect(newState.getIn(['validationStages', 1, 'status'])).toEqual('failed');
  });

  it('should handle UPDATE_VALIDATION_STATUS', () => {
    const action = {
      type: ValidationsConstants.UPDATE_VALIDATION_STATUS,
      payload: {
        uuid: 1,
        status: 'error'
      }
    };
    const newState = validationsReducer(updatedState, action);
    expect(newState.getIn(['validations', 1, 'status'])).toEqual('error');
  });
});
