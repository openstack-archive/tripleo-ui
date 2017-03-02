import { Map, OrderedMap } from 'immutable';

import { WorkflowExecution } from '../../js/immutableRecords/workflowExecutions';
import WorkflowExecutionsConstants from '../../js/constants/WorkflowExecutionsConstants';
import workflowExecutionsReducer from '../../js/reducers/workflowExecutionsReducer';
import MistralConstants from '../../js/constants/MistralConstants';

describe('workflowExecutionsReducer', () => {
  const initialState = Map({
    executionsLoaded: false,
    isFetching: false,
    executions: OrderedMap()
  });

  const updatedState = Map({
    isFetching: false,
    executionsLoaded: true,
    executions: OrderedMap({
      '1a': new WorkflowExecution({
        created_at: '2016-07-18 14:05:05',
        description: '',
        id: '1a',
        input: Map({
          validation_name: 'check-network-gateway',
          queue_name: 'tripleo',
          plan: 'plan'
        }),
        output: Map(),
        params: Map(),
        state: 'SUCCESS',
        state_info: '',
        task_execution_id: null,
        updated_at: 1468843508000,
        workflow_id: 'f8b280bb-5ba2-486b-9384-ddd79300d987',
        workflow_name: MistralConstants.VALIDATIONS_RUN
      })
    })
  });

  it('should return initial state', () => {
    expect(workflowExecutionsReducer(initialState, {})).toEqual(initialState);
  });

  it('should handle FETCH_WORKFLOW_EXECUTIONS_PENDING', () => {
    const action = {
      type: WorkflowExecutionsConstants.FETCH_WORKFLOW_EXECUTIONS_PENDING
    };
    const newState = workflowExecutionsReducer(initialState, action);
    expect(newState.get('isFetching')).toEqual(true);
  });

  it('should handle FETCH_WORKFLOW_EXECUTIONS_SUCCESS', () => {
    const action = {
      type: WorkflowExecutionsConstants.FETCH_WORKFLOW_EXECUTIONS_SUCCESS,
      payload: {
        '1a': {
          created_at: '2016-07-18 14:05:05',
          description: '',
          id: '1a',
          input: `{"validation_name": "check-network-gateway",
                   "queue_name": "tripleo", "plan": "plan"}`,
          output: '{}',
          params: '{}',
          state: 'SUCCESS',
          state_info: '',
          task_execution_id: null,
          updated_at: '2016-07-18 14:05:08',
          workflow_id: 'f8b280bb-5ba2-486b-9384-ddd79300d987',
          workflow_name: MistralConstants.VALIDATIONS_RUN
        }
      }
    };
    const newState = workflowExecutionsReducer(initialState, action);
    expect(newState.get('executions')).toEqual(updatedState.get('executions'));
  });

  it('should handle FETCH_WORKFLOW_EXECUTIONS_FAILED', () => {
    const action = {
      type: WorkflowExecutionsConstants.FETCH_WORKFLOW_EXECUTIONS_FAILED
    };
    const newState = workflowExecutionsReducer(initialState, action);
    expect(newState.get('isFetching')).toEqual(false);
    expect(newState.get('executionsLoaded')).toEqual(true);
  });

  it('should handle ADD_WORKFLOW_EXECUTION', () => {
    const action = {
      type: WorkflowExecutionsConstants.ADD_WORKFLOW_EXECUTION,
      payload: {
        created_at: '2016-07-18 14:05:05',
        description: '',
        id: '1a',
        input: `{"validation_name": "check-network-gateway",
                 "queue_name": "tripleo", "plan": "plan"}`,
        output: '{}',
        params: '{}',
        state: 'SUCCESS',
        state_info: '',
        task_execution_id: null,
        updated_at: '2016-07-18 14:05:08',
        workflow_id: 'f8b280bb-5ba2-486b-9384-ddd79300d987',
        workflow_name: MistralConstants.VALIDATIONS_RUN
      }
    };
    const newState = workflowExecutionsReducer(initialState, action);
    expect(newState.get('executions')).toEqual(updatedState.get('executions'));
  });

  it('should handle UPDATE_WORKFLOW_EXECUTION_PENDING', () => {
    const action = {
      type: WorkflowExecutionsConstants.UPDATE_WORKFLOW_EXECUTION_PENDING,
      payload: {
        id: '1a',
        patch: { state: 'PAUSED' }
      }
    };
    const newState = workflowExecutionsReducer(initialState, action);
    expect(newState.getIn(['executions', '1a', 'state'])).toEqual('PAUSED');
  });
});
