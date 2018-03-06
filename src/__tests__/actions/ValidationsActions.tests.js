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

import MistralApiService from '../../js/services/MistralApiService';
import ValidationsActions from '../../js/actions/ValidationsActions';
import ValidationsConstants from '../../js/constants/ValidationsConstants';
import * as WorkflowActions from '../../js/actions/WorkflowActions';
import MistralConstants from '../../js/constants/MistralConstants';
import { mockStore } from './utils';

describe('Validations actions', () => {
  it('should create an action for pending Validations request', () => {
    const expectedAction = {
      type: ValidationsConstants.FETCH_VALIDATIONS_PENDING
    };
    expect(ValidationsActions.fetchValidationsPending()).toEqual(
      expectedAction
    );
  });

  it('should create an action for successful Validations retrieval', () => {
    const normalizedValidations = {
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
    };
    const expectedAction = {
      type: ValidationsConstants.FETCH_VALIDATIONS_SUCCESS,
      payload: normalizedValidations
    };
    expect(
      ValidationsActions.fetchValidationsSuccess(normalizedValidations)
    ).toEqual(expectedAction);
  });

  it('should create an action for failed Validations request', () => {
    const expectedAction = {
      type: ValidationsConstants.FETCH_VALIDATIONS_FAILED
    };
    expect(ValidationsActions.fetchValidationsFailed()).toEqual(expectedAction);
  });
});

describe('FetchValidations action', () => {
  const store = mockStore({});
  const response = [{ id: '512e' }, { id: 'check-network-gateway' }];
  const normalizedResponse = {
    '512e': { id: '512e' },
    'check-network-gateway': { id: 'check-network-gateway' }
  };
  beforeEach(() => {
    MistralApiService.runAction = jest
      .fn()
      .mockReturnValue(() => Promise.resolve(response));
  });

  it('dispatches appropriate actions and normalizes the response', () => {
    return store.dispatch(ValidationsActions.fetchValidations()).then(() => {
      expect(MistralApiService.runAction).toHaveBeenCalledWith(
        MistralConstants.VALIDATIONS_LIST
      );
      expect(store.getActions()).toEqual([
        ValidationsActions.fetchValidationsPending(),
        ValidationsActions.fetchValidationsSuccess(normalizedResponse)
      ]);
    });
  });
});

describe('RunValidation action', () => {
  const store = mockStore({});
  const execution = {
    state_info: null,
    created_at: '2016-07-19 13:22:29.588140',
    description: '',
    state: 'RUNNING',
    workflow_name: MistralConstants.VALIDATIONS_RUN,
    task_execution_id: null,
    updated_at: '2016-07-19 13:22:29.592989',
    workflow_id: 'f8b280bb-5ba2-486b-9384-ddd79300d987',
    params: '{}',
    output: '{}',
    input: `{\"validation_name\": \"check-network-gateway\",
              \"queue_name\": \"tripleo\", \"plan\": \"plan\"}`,
    id: 'dc971ab5-7f17-43d2-8944-1f0ffade502d'
  };

  beforeEach(() => {
    WorkflowActions.startWorkflow = jest
      .fn()
      .mockReturnValue(() => Promise.resolve(execution));
  });

  it('dispatches appropriate actions', () => {
    return store
      .dispatch(ValidationsActions.runValidation('512e', 'overcloud'))
      .then(() => {
        expect(WorkflowActions.startWorkflow).toHaveBeenCalledWith(
          MistralConstants.VALIDATIONS_RUN,
          {
            validation_name: '512e',
            plan: 'overcloud'
          }
        );
        expect(store.getActions()).toEqual([]);
      });
  });
});
