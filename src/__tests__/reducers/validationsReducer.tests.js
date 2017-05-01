import { List, Map } from 'immutable';

import { Validation } from '../../js/immutableRecords/validations';
import ValidationsConstants from '../../js/constants/ValidationsConstants';
import validationsReducer from '../../js/reducers/validationsReducer';

describe('validationsReducer', () => {
  const initialState = Map({
    validationsLoaded: false,
    isFetching: false,
    validations: Map()
  });

  const updatedState = Map({
    isFetching: false,
    validationsLoaded: true,
    validations: Map({
      '512e': new Validation({
        description: '',
        groups: List(['pre-deployment']),
        id: '512e',
        metadata: Map(),
        name: 'Advanced Format 512e Support',
        results: Map(),
        status: undefined,
        stateInfo: undefined
      }),
      'check-network-gateway': new Validation({
        description: '',
        groups: List(['pre-deployment']),
        id: 'check-network-gateway',
        metadata: Map(),
        name: 'Check network_gateway on the provisioning network',
        results: Map(),
        status: undefined,
        stateInfo: undefined
      })
    })
  });

  it('should return initial state', () => {
    expect(validationsReducer(initialState, {})).toEqual(initialState);
  });

  it('should handle FETCH_VALIDATIONS_PENDING', () => {
    const action = {
      type: ValidationsConstants.FETCH_VALIDATIONS_PENDING
    };
    const newState = validationsReducer(initialState, action);
    expect(newState.get('isFetching')).toEqual(true);
  });

  it('should handle FETCH_VALIDATIONS_SUCCESS', () => {
    const action = {
      type: ValidationsConstants.FETCH_VALIDATIONS_SUCCESS,
      payload: {
        '512e': {
          description: '',
          metadata: {},
          id: '512e',
          groups: ['pre-deployment'],
          name: 'Advanced Format 512e Support'
        },
        'check-network-gateway': {
          description: '',
          metadata: {},
          id: 'check-network-gateway',
          groups: ['pre-deployment'],
          name: 'Check network_gateway on the provisioning network'
        }
      }
    };
    const newState = validationsReducer(initialState, action);
    expect(newState.get('validations')).toEqual(
      updatedState.get('validations')
    );
  });

  it('should handle FETCH_VALIDATIONS_FAILED', () => {
    const action = {
      type: ValidationsConstants.FETCH_VALIDATIONS_FAILED
    };
    const newState = validationsReducer(initialState, action);
    expect(newState.get('isFetching')).toEqual(false);
    expect(newState.get('validationsLoaded')).toEqual(true);
  });
});
