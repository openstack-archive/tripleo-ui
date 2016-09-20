import matchers from 'jasmine-immutable-matchers';
import { List, Map } from 'immutable';

import { ParametersDefaultState } from '../../js/immutableRecords/parameters';
import ParametersConstants from '../../js/constants/ParametersConstants';
import parametersReducer from '../../js/reducers/parametersReducer';

const parametersPayload = {
  resourceTree: {
    Description: 'lorem ipsum',
    Parameters: {
      AdminPassword: {
        Default: 'pwd',
        Description: 'The password for the keystone admin account',
        Label: 'AdminPassword',
        NoEcho: 'true',
        Type: 'String'
      }
    },
    NestedParameters: {
      AllNodesExtraConfig: {
        Description: 'Noop extra config for allnodes extra cluster config',
        Type: 'OS::TripleO::AllNodesExtraConfig',
        Parameters: {
          blockstorage_servers: {
            Description: '',
            Label: 'blockstorage_servers',
            NoEcho: 'false',
            Type: 'Json'
          }
        }
      }
    }
  },
  mistralParameters: {}
};

const parametersExpectedState = Map({
  Description: 'lorem ipsum',
  NestedParameters: Map({
    AllNodesExtraConfig: Map({
      Description: 'Noop extra config for allnodes extra cluster config',
      Parameters: Map({
        blockstorage_servers: Map({
          Description: '',
          Label: 'blockstorage_servers',
          NoEcho: 'false',
          Type: 'Json'
        })
      }),
      Type: 'OS::TripleO::AllNodesExtraConfig'
    })
  }),
  Parameters: Map({
    AdminPassword: Map({
      Default: 'pwd',
      Description: 'The password for the keystone admin account',
      Label: 'AdminPassword',
      NoEcho: 'true',
      Type: 'String'
    })
  })
});

describe('parametersReducer', () => {
  beforeEach(() => {
    jasmine.addMatchers(matchers);
  });

  describe('FETCH_PARAMETERS_PENDING', () => {
    let state;
    const action = {
      type: ParametersConstants.FETCH_PARAMETERS_PENDING
    };

    beforeEach(() => {
      state = parametersReducer(ParametersDefaultState({
        isFetching: false,
        form: Map({ formErrors: List.of('lorem ipsum'), formFieldErrors: Map({ field: 'foo' })}),
        resourceTree: Map({ description: 'lorem ipsum' })
      }), action);
    });

    it('sets isFetching to `true`', () => {
      expect(state.isFetching).toBe(true);
    });

    it('resets form', () => {
      expect(state.form).toEqualImmutable(Map({
        formErrors: List(),
        formFieldErrors: Map()
      }));
    });
  });

  describe('FETCH_PARAMETERS_SUCCESS', () => {
    let state;
    const action = {
      type: ParametersConstants.FETCH_PARAMETERS_SUCCESS,
      payload: parametersPayload
    };

    beforeEach(() => {
      state = parametersReducer(ParametersDefaultState({
        isFetching: true,
        form: Map({ some: 'value' })
      }), action);
    });

    it('sets isFetching to `false`', () => {
      expect(state.isFetching).toBe(false);
    });

    it('resets form', () => {
      expect(state.form).toEqualImmutable(Map({
        formErrors: List(),
        formFieldErrors: Map()
      }));
    });

    it('sets resourceTree', () => {
      expect(state.resourceTree).toEqualImmutable(parametersExpectedState);
    });
  });

  describe('UPDATE_PARAMETERS_FAILED', () => {
    let state;
    const action = {
      type: ParametersConstants.UPDATE_PARAMETERS_FAILED,
      payload: {
        formErrors: [{ foo: 'bar' }],
        formFieldErrors: { field1: 'fail' }
      }
    };

    beforeEach(() => {
      state = parametersReducer(ParametersDefaultState({
        isFetching: true
      }), action);
    });

    it('sets `isFetching` to false', () => {
      expect(state.isFetching).toBe(false);
    });

    it('sets errors in  `form`', () => {
      expect(state.form).toEqual(Map({
        formErrors: List.of({ foo: 'bar' }),
        formFieldErrors: Map({ field1: 'fail' })
      }));
    });
  });

  describe('UPDATE_PARAMETERS_PENDING', () => {
    let state;
    const action = {
      type: ParametersConstants.UPDATE_PARAMETERS_PENDING
    };

    beforeEach(() => {
      state = parametersReducer(ParametersDefaultState({
        isFetching: false
      }), action);
    });

    it('sets `isFetching` to true', () => {
      expect(state.isFetching).toBe(true);
    });
  });

  describe('UPDATE_PARAMETERS_SUCCESS', () => {
    let state;
    const action = {
      type: ParametersConstants.UPDATE_PARAMETERS_SUCCESS
    };

    beforeEach(() => {
      state = parametersReducer(ParametersDefaultState({
        isFetching: true,
        form: Map({ some: 'value' })
      }), action);
    });

    it('sets isFetching to `false`', () => {
      expect(state.isFetching).toBe(false);
    });

    it('resets form', () => {
      expect(state.form).toEqualImmutable(Map({
        formErrors: List(),
        formFieldErrors: Map()
      }));
    });
  });
});
