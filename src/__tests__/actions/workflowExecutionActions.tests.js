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

import when from 'when';

import MistralApiService from '../../js/services/MistralApiService';
import WorkflowExecutionsActions
  from '../../js/actions/WorkflowExecutionsActions';

let createResolvingPromise = data => {
  return () => {
    return when.resolve(data);
  };
};

describe('fetchWorkflowExecutions action', () => {
  beforeEach(done => {
    spyOn(WorkflowExecutionsActions, 'fetchWorkflowExecutionsPending');
    spyOn(WorkflowExecutionsActions, 'fetchWorkflowExecutionsSuccess');

    const response = {
      executions: [
        {
          state: 'SUCCESS',
          params: '{}',
          output: "{'status': 'FAILED',}",
          input: "{'validation_name': 'check-network-gateway'}",
          id: '1a'
        }
      ]
    };

    spyOn(MistralApiService, 'getWorkflowExecutions').and.callFake(
      createResolvingPromise(response)
    );

    WorkflowExecutionsActions.fetchWorkflowExecutions()(() => {}, () => {});
    setTimeout(() => {
      done();
    }, 1);
  });

  it('dispatches appropriate actions and normalizes the response', () => {
    expect(
      WorkflowExecutionsActions.fetchWorkflowExecutionsPending
    ).toHaveBeenCalled();
    expect(MistralApiService.getWorkflowExecutions).toHaveBeenCalled();
    expect(
      WorkflowExecutionsActions.fetchWorkflowExecutionsSuccess
    ).toHaveBeenCalled();
  });
});

describe('updateWorkflowExecution action', () => {
  beforeEach(done => {
    spyOn(WorkflowExecutionsActions, 'updateWorkflowExecutionPending');
    spyOn(WorkflowExecutionsActions, 'addWorkflowExecution');

    spyOn(MistralApiService, 'updateWorkflowExecution').and.callFake(
      createResolvingPromise()
    );

    WorkflowExecutionsActions.updateWorkflowExecution('512e', {
      state: 'PAUSED'
    })(() => {}, () => {});
    setTimeout(() => {
      done();
    }, 1);
  });

  it('dispatches appropriate actions', () => {
    expect(
      WorkflowExecutionsActions.updateWorkflowExecutionPending
    ).toHaveBeenCalledWith('512e', { state: 'PAUSED' });
    expect(
      MistralApiService.updateWorkflowExecution
    ).toHaveBeenCalledWith('512e', { state: 'PAUSED' });
    expect(WorkflowExecutionsActions.addWorkflowExecution).toHaveBeenCalled();
  });
});
