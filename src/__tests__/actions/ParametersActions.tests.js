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

import * as ReduxFormActions from 'redux-form';

import * as ErrorActions from '../../js/actions/ErrorActions';
import ParametersActions from '../../js/actions/ParametersActions';
import ParametersConstants from '../../js/constants/ParametersConstants';
import MistralApiService from '../../js/services/MistralApiService';
import MistralConstants from '../../js/constants/MistralConstants';
import { mockStore } from './utils';
import storage from '../mocks/storage';

window.localStorage = window.sessionStorage = storage;

describe('ParametersActions', () => {
  describe('fetchParametersPending', () => {
    it('returns ParametersConstants.FETCH_PARAMETERS_PENDING', () => {
      expect(ParametersActions.fetchParametersPending()).toEqual({
        type: ParametersConstants.FETCH_PARAMETERS_PENDING
      });
    });
  });

  describe('fetchParametersSuccess', () => {
    it('returns ParametersConstants.FETCH_PARAMETERS_SUCCESS', () => {
      expect(ParametersActions.fetchParametersSuccess({ foo: 'bar' })).toEqual({
        type: ParametersConstants.FETCH_PARAMETERS_SUCCESS,
        payload: { foo: 'bar' }
      });
    });
  });

  describe('fetchParameters (success)', () => {
    const store = mockStore({});
    let responseBody = {
      heat_resource_tree: {
        resources: {
          aaa: { id: 'aaa', name: 'Root' }
        },
        parameters: {
          param1: { name: 'param1', default: 'someValue' }
        }
      },
      environment_parameters: {
        param1: 'someValue'
      }
    };
    const normalizedResponse = {
      resources: {
        aaa: { id: 'aaa', name: 'Root' }
      },
      parameters: {
        param1: { name: 'param1', default: 'someValue' }
      },
      mistralParameters: {
        param1: 'someValue'
      }
    };

    beforeEach(() => {
      MistralApiService.runAction = jest
        .fn()
        .mockReturnValue(() => Promise.resolve(responseBody));
    });

    it('dispatches actions', () => {
      return store
        .dispatch(ParametersActions.fetchParameters('overcloud'))
        .then(() => {
          expect(MistralApiService.runAction).toHaveBeenCalled();
          expect(store.getActions()).toEqual([
            ParametersActions.fetchParametersPending(),
            ParametersActions.fetchParametersSuccess(normalizedResponse)
          ]);
        });
    });
  });

  describe('updateParameters (fail)', () => {
    const store = mockStore({});
    const error = { message: 'Some Error' };

    beforeEach(() => {
      MistralApiService.runAction = jest
        .fn()
        .mockReturnValue(() => Promise.reject(error));
      ErrorActions.handleErrors = jest.fn().mockReturnValue(() => {});
    });

    it('calls required actions', () => {
      return store
        .dispatch(
          ParametersActions.updateParameters('overcloud', { foo: 'bar' })
        )
        .then(() => {
          expect(MistralApiService.runAction).toHaveBeenCalledWith(
            MistralConstants.PARAMETERS_UPDATE,
            {
              container: 'overcloud',
              parameters: { foo: 'bar' }
            }
          );
          expect(store.getActions()).toEqual([
            ReduxFormActions.startSubmit('nodesAssignment'),
            ParametersActions.updateParametersPending(),
            ReduxFormActions.stopSubmit('nodesAssignment', {
              _error: {
                title: 'Parameters could not be updated',
                message: error.message
              }
            }),
            ParametersActions.updateParametersFailed([
              {
                title: 'Parameters could not be updated',
                message: error.message
              }
            ])
          ]);
        });
    });
  });

  describe('updateParametersFailed', () => {
    it('returns ParametersConstants.UPDATE_PARAMETERS_FAILED', () => {
      expect(
        ParametersActions.updateParametersFailed([{ foo: 'bar' }], {
          field1: 'fail'
        })
      ).toEqual({
        type: ParametersConstants.UPDATE_PARAMETERS_FAILED,
        payload: {
          formErrors: [{ foo: 'bar' }],
          formFieldErrors: { field1: 'fail' }
        }
      });
    });
  });
});
