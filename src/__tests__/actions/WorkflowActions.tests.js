/**
 * Copyright 2018 Red Hat Inc.
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

jest.useFakeTimers();

import { mockStore } from './utils';
import MistralApiService from '../../js/services/MistralApiService';
import WorkflowExecutionsActions from '../../js/actions/WorkflowExecutionsActions';
import * as WorkflowActions from '../../js/actions/WorkflowActions';
import * as WorkflowExecutionsSelectors from '../../js/selectors/workflowExecutions';
import * as WorkflowExecutionTimeoutsSelectors from '../../js/selectors/workflowExecutionTimeouts';

describe('startWorkflow action', () => {
  const store = mockStore({});
  const execution = {
    id: '047d76c2-637d-4199-841b-7abbe9e4706b'
  };

  beforeEach(() => {
    MistralApiService.runWorkflow = jest
      .fn()
      .mockReturnValue(() => Promise.resolve(execution));
  });

  it('dispatches expected actions and sets timeout', () => {
    const onFinished = jest.fn();
    return store
      .dispatch(
        WorkflowActions.startWorkflow('TEST_WORKFLOW', {}, onFinished, 1000)
      )
      .then(() => {
        expect(MistralApiService.runWorkflow).toHaveBeenCalledWith(
          'TEST_WORKFLOW',
          {}
        );
        expect(store.getActions()).toEqual([
          WorkflowExecutionsActions.addWorkflowExecution(execution),
          WorkflowActions.setWorkflowTimeout(execution.id, expect.any(Number))
        ]);
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
      });
  });
});

describe('pollWorkflowExecution action for RUNNING execution', () => {
  const store = mockStore({});

  it('dispatches expected actions and sets timeout', () => {
    const execution = {
      id: '047d76c2-637d-4199-841b-7abbe9e4706b',
      state: 'RUNNING'
    };
    MistralApiService.getWorkflowExecution = jest
      .fn()
      .mockReturnValue(() => Promise.resolve(execution));

    return store
      .dispatch(WorkflowActions.pollWorkflowExecution(execution.id, jest.fn()))
      .then(() => {
        expect(MistralApiService.getWorkflowExecution).toHaveBeenCalledWith(
          execution.id
        );
        expect(store.getActions()).toEqual([
          WorkflowExecutionsActions.addWorkflowExecution(execution),
          WorkflowActions.setWorkflowTimeout(execution.id, expect.any(Number))
        ]);
        expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 2500);
      });
  });
});

describe('pollWorkflowExecution action with finished execution', () => {
  const store = mockStore({});
  it('dispatches expected actions', () => {
    const execution = {
      id: '047d76c2-637d-4199-841b-7abbe9e4706b',
      state: 'SUCCESS'
    };
    MistralApiService.getWorkflowExecution = jest
      .fn()
      .mockReturnValue(() => Promise.resolve(execution));
    const onFinished = jest.fn().mockReturnValue(jest.fn());

    return store
      .dispatch(WorkflowActions.pollWorkflowExecution(execution.id, onFinished))
      .then(() => {
        expect(MistralApiService.getWorkflowExecution).toHaveBeenCalledWith(
          execution.id
        );
        expect(store.getActions()).toEqual([
          WorkflowExecutionsActions.addWorkflowExecution(execution),
          WorkflowActions.cancelWorkflowTimeout(execution.id)
        ]);
        expect(onFinished).toHaveBeenCalledWith(execution);
      });
  });
});

describe('handleWorkflowMessage action', () => {
  it('dispatches expected actions', () => {
    const store = mockStore({});
    WorkflowExecutionsSelectors.getWorkflowExecution = jest
      .fn()
      .mockReturnValue({ id: 'running-execution-id', state: 'RUNNING' });
    WorkflowExecutionTimeoutsSelectors.getWorkflowExecutionTimeout = jest
      .fn()
      .mockReturnValue({ 'running-execution-id': 1 });
    store.dispatch(
      WorkflowActions.handleWorkflowMessage('running-execution-id', jest.fn())
    );
    expect(clearTimeout).toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      WorkflowActions.cancelWorkflowTimeout('running-execution-id')
    ]);
    jest.clearAllMocks();
  });

  it('dispatches reacts to message when application has no record of the execution', () => {
    const store = mockStore({});
    WorkflowExecutionsSelectors.getWorkflowExecution = jest
      .fn()
      .mockReturnValue(undefined);
    WorkflowExecutionTimeoutsSelectors.getWorkflowExecutionTimeout = jest
      .fn()
      .mockReturnValue(undefined);
    store.dispatch(
      WorkflowActions.handleWorkflowMessage('unknown-execution-id', jest.fn())
    );
    expect(clearTimeout).toHaveBeenCalled();
    expect(store.getActions()).toEqual([
      WorkflowActions.cancelWorkflowTimeout('unknown-execution-id')
    ]);
    jest.clearAllMocks();
  });

  it('does not react to message when execution is not RUNNING', () => {
    const store = mockStore({});
    WorkflowExecutionsSelectors.getWorkflowExecution = jest
      .fn()
      .mockReturnValue({ id: 'finished-execution-id', state: 'SUCCESS' });
    store.dispatch(
      WorkflowActions.handleWorkflowMessage('finished-execution-id', jest.fn())
    );
    expect(clearTimeout).not.toHaveBeenCalled();
    expect(store.getActions()).toEqual([]);
    jest.clearAllMocks();
  });
});
