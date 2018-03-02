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

import { Map } from 'immutable';

import WorkflowExecutionsConstants from '../../js/constants/WorkflowExecutionsConstants';
import workflowExecutionTimeoutsReducer from '../../js/reducers/workflowExecutionTimeoutsReducer';

describe('workflowExecutionTimeoutsReducer', () => {
  const initialState = Map();

  const updatedState = Map({
    'some-execution-id': 1
  });

  it('should return initial state', () => {
    expect(workflowExecutionTimeoutsReducer(initialState, {})).toEqual(
      initialState
    );
  });

  it('should handle SET_WORKFLOW_TIMEOUT', () => {
    const action = {
      type: WorkflowExecutionsConstants.SET_WORKFLOW_TIMEOUT,
      payload: {
        executionId: 'some-execution-id',
        timeout: 1
      }
    };
    const newState = workflowExecutionTimeoutsReducer(initialState, action);
    expect(newState).toEqual(updatedState);
  });

  it('should handle CANCEL_WORKFLOW_TIMEOUT', () => {
    const action = {
      type: WorkflowExecutionsConstants.CANCEL_WORKFLOW_TIMEOUT,
      payload: 'some-execution-id'
    };
    const newState = workflowExecutionTimeoutsReducer(updatedState, action);
    expect(newState).toEqual(initialState);
  });
});
