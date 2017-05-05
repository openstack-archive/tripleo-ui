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

import { List, Map } from 'immutable';

import { ParametersDefaultState, Parameter } from '../../js/immutableRecords/parameters';
import ParametersConstants from '../../js/constants/ParametersConstants';
import parametersReducer from '../../js/reducers/parametersReducer';

const parametersActionPayload = {
  mistralParameters: {
    parameter1: '1'
  },
  parameters: {
    parameter1: {
      default: '3PuRFRBdhHDD49Td4jHJYmD3n',
      type: 'String',
      noEcho: 'true',
      description: 'The password for the glance service and db account',
      label: 'GlancePassword',
      name: 'GlancePassword'
    }
  },
  resources: {
    '1d0e0c81-2dc6-4b39-a9a7-9ef4fab65ecf': {
      nestedParameters: [
        'd1f30e6b-c835-49d8-a21e-2983bde15bab'
      ],
      type: 'OS::TripleO::Services::HeatEngine',
      description: 'Openstack Heat Engine service configured with Puppet\n',
      parameters: [
        'DefaultPasswords',
        'HeatWorkers',
        'ServiceNetMap',
        'HeatAuthEncryptionKey',
        'HeatEngineLoggingSource',
        'EndpointMap',
        'HeatEnableDBPurge',
        'HeatStackDomainAdminPassword',
        'HeatPassword',
        'MonitoringSubscriptionHeatEngine'
      ],
      name: '16',
      id: '1d0e0c81-2dc6-4b39-a9a7-9ef4fab65ecf'
    }
  }
};

describe('parametersReducer', () => {
  describe('FETCH_PARAMETERS_PENDING', () => {
    let state;
    const action = {
      type: ParametersConstants.FETCH_PARAMETERS_PENDING
    };

    beforeEach(() => {
      state = parametersReducer(ParametersDefaultState({
        isFetching: false,
        form: Map({ formErrors: List.of('lorem ipsum'), formFieldErrors: Map({ field: 'foo' })})
      }), action);
    });

    it('sets isFetching to `true`', () => {
      expect(state.isFetching).toBe(true);
    });

    it('resets form', () => {
      expect(state.form).toEqual(Map({
        formErrors: List(),
        formFieldErrors: Map()
      }));
    });
  });

  describe('FETCH_PARAMETERS_SUCCESS', () => {
    let state;
    const action = {
      type: ParametersConstants.FETCH_PARAMETERS_SUCCESS,
      payload: parametersActionPayload
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
      expect(state.form).toEqual(Map({
        formErrors: List(),
        formFieldErrors: Map()
      }));
    });

    it('sets parameters', () => {
      expect(state.parameters.size).toEqual(1);
      expect(state.parameters.getIn(['parameter1', 'default']))
        .toEqual('3PuRFRBdhHDD49Td4jHJYmD3n');
      expect(Map.isMap(state.parameters)).toBe(true);
    });

    it('sets resources', () => {
      expect(state.resources.size).toEqual(1);
      expect(state.resources.getIn(['1d0e0c81-2dc6-4b39-a9a7-9ef4fab65ecf', 'parameters']).size)
        .toEqual(10);
      expect(Map.isMap(state.resources)).toBe(true);
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
      type: ParametersConstants.UPDATE_PARAMETERS_SUCCESS,
      payload: { foo: 'bar' }
    };

    beforeEach(() => {
      state = parametersReducer(ParametersDefaultState({
        isFetching: true,
        form: Map({ some: 'value' }),
        parameters: Map({
          foo: new Parameter({
            name: 'foo'
          })
        })
      }), action);
    });

    it('sets isFetching to `false`', () => {
      expect(state.isFetching).toBe(false);
    });

    it('resets form', () => {
      expect(state.form).toEqual(Map({
        formErrors: List(),
        formFieldErrors: Map()
      }));
    });

    it('updates parameters in state with new values', () => {
      expect(state.parameters.get('foo').default).toEqual('bar');
    });
  });
});
