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
import WorkflowExecutionsActions
  from '../../js/actions/WorkflowExecutionsActions';
import { mockStore } from './utils';

describe('fetchWorkflowExecutions action', () => {
  const store = mockStore({});
  const response = [
    {
      state: 'SUCCESS',
      params: '{}',
      output: "{'status': 'FAILED',}",
      input: "{'validation_name': 'check-network-gateway'}",
      id: '1a'
    }
  ];
  const normalizedResponse = {
    '1a': {
      state: 'SUCCESS',
      params: '{}',
      output: "{'status': 'FAILED',}",
      input: "{'validation_name': 'check-network-gateway'}",
      id: '1a'
    }
  };

  beforeEach(() => {
    MistralApiService.getWorkflowExecutions = jest
      .fn()
      .mockReturnValue(() => Promise.resolve(response));
  });

  it('dispatches appropriate actions and normalizes the response', () => {
    return store
      .dispatch(WorkflowExecutionsActions.fetchWorkflowExecutions())
      .then(() => {
        expect(MistralApiService.getWorkflowExecutions).toHaveBeenCalled();
        expect(store.getActions()).toEqual([
          WorkflowExecutionsActions.fetchWorkflowExecutionsPending(),
          WorkflowExecutionsActions.fetchWorkflowExecutionsSuccess(
            normalizedResponse
          )
        ]);
      });
  });
});

describe('updateWorkflowExecution action', () => {
  const store = mockStore({});

  beforeEach(() => {
    MistralApiService.updateWorkflowExecution = jest
      .fn()
      .mockReturnValue(() => Promise.resolve());
  });

  it('dispatches appropriate actions', () => {
    return store
      .dispatch(
        WorkflowExecutionsActions.updateWorkflowExecution('512e', {
          state: 'PAUSED'
        })
      )
      .then(() => {
        expect(
          MistralApiService.updateWorkflowExecution
        ).toHaveBeenCalledWith('512e', { state: 'PAUSED' });
        expect(store.getActions()).toEqual([
          WorkflowExecutionsActions.updateWorkflowExecutionPending('512e', {
            state: 'PAUSED'
          }),
          WorkflowExecutionsActions.addWorkflowExecution()
        ]);
      });
  });
});
