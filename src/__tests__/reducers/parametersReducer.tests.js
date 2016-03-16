import matchers from 'jasmine-immutable-matchers';
import { List, Map } from 'immutable';

import { Parameter,
         ParametersDefaultState } from '../../js/immutableRecords/parameters';
import ParametersConstants from '../../js/constants/ParametersConstants';
import parametersReducer from '../../js/reducers/parametersReducer';

const parametersPayload = {
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
};

const parametersExpectedState = Map({
  Description: 'lorem ipsum',
  NestedParameters: Map({
    AllNodesExtraConfig: new Parameter({
      Description: 'Noop extra config for allnodes extra cluster config',
      Name: 'AllNodesExtraConfig',
      Parameters: Map({
        blockstorage_servers: new Parameter({
          Name: 'blockstorage_servers',
          Label: 'blockstorage_servers',
          NoEcho: 'false',
          Type: 'Json'
        })
      }),
      Type: 'OS::TripleO::AllNodesExtraConfig'
    })
  }),
  Parameters: Map({
    AdminPassword: new Parameter({
      Default: 'pwd',
      Description: 'The password for the keystone admin account',
      Label: 'AdminPassword',
      Name: 'AdminPassword',
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
        isPending: false,
        form: Map({ formErrors: List.of('lorem ipsum'), formFieldErrors: Map({ field: 'foo' })}),
        parameters: Map({ description: 'lorem ipsum' })
      }), action);
    });

    it('sets isPending to `true`', () => {
      expect(state.isPending).toBe(true);
    });

    it('resets parameters', () => {
      expect(state.parameters).toEqualImmutable(Map());
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
        isPending: true,
        form: Map({ some: 'value' })
      }), action);
    });

    it('sets isPending to `false`', () => {
      expect(state.isPending).toBe(false);
    });

    it('resets form', () => {
      expect(state.form).toEqualImmutable(Map({
        formErrors: List(),
        formFieldErrors: Map()
      }));
    });

    it('sets parameter records', () => {
      expect(state.parameters).toEqualImmutable(parametersExpectedState);
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
        isPending: true
      }), action);
    });

    it('sets `isPending` to false', () => {
      expect(state.isPending).toBe(false);
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
        isPending: false
      }), action);
    });

    it('sets `isPending` to true', () => {
      expect(state.isPending).toBe(true);
    });
  });

  describe('UPDATE_PARAMETERS_SUCCESS', () => {
    let state;
    const action = {
      type: ParametersConstants.UPDATE_PARAMETERS_SUCCESS,
      payload: parametersPayload
    };

    beforeEach(() => {
      state = parametersReducer(ParametersDefaultState({
        isPending: true,
        form: Map({ some: 'value' })
      }), action);
    });

    it('sets isPending to `false`', () => {
      expect(state.isPending).toBe(false);
    });

    it('resets form', () => {
      expect(state.form).toEqualImmutable(Map({
        formErrors: List(),
        formFieldErrors: Map()
      }));
    });

    it('sets parameter records', () => {
      expect(state.parameters).toEqualImmutable(parametersExpectedState);
    });
  });
});
