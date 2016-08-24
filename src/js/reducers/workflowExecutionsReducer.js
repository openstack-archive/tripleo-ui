import { fromJS, Map, OrderedMap } from 'immutable';

import WorkflowExecutionsConstants from '../constants/WorkflowExecutionsConstants';
import { WorkflowExecution } from '../immutableRecords/workflowExecutions';

const initialState = Map({
  executionsLoaded: false,
  isFetching: false,
  executions: OrderedMap()
});

export default function workflowExecutionsReducer(state = initialState, action) {
  switch(action.type) {

  case WorkflowExecutionsConstants.FETCH_WORKFLOW_EXECUTIONS_PENDING:
    return state.set('isFetching', true);

  case WorkflowExecutionsConstants.FETCH_WORKFLOW_EXECUTIONS_SUCCESS: {
    const executions = fromJS(action.payload)
                         .map(execution => new WorkflowExecution(parseExecutionAttrs(execution)))
                         .sortBy(execution => execution.updated_at);
    return state.set('executions', executions)
                .set('executionsLoaded', true)
                .set('isFetching', false);
  }

  case WorkflowExecutionsConstants.FETCH_WORKFLOW_EXECUTIONS_FAILED:
    return state.set('executionsLoaded', true)
                .set('isFetching', false);

  case WorkflowExecutionsConstants.ADD_WORKFLOW_EXECUTION:
    return state.update('executions', executions =>
                          executions.set(action.payload.id,
                                         new WorkflowExecution(
                                           parseExecutionAttrs(fromJS(action.payload)))));

  case WorkflowExecutionsConstants.ADD_WORKFLOW_EXECUTION_FROM_MESSAGE:
    return state.update('executions',
                        executions => executions.set(action.payload.id, action.payload));

  case WorkflowExecutionsConstants.UPDATE_WORKFLOW_EXECUTION_PENDING:
    return state.mergeIn(['executions', action.payload.id], fromJS(action.payload.patch));

  default:
    return state;

  }
}

/**
 * Executions properties input, output and params are JSON strings, this function parses them into
 * objects
 */
const parseExecutionAttrs = execution => 
  execution.set('input', fromJS(JSON.parse(execution.get('input', '{}'))))
           .set('output', fromJS(JSON.parse(execution.get('output', '{}'))))
           .set('params', fromJS(JSON.parse(execution.get('params', '{}'))))
           .set('updated_at', fromJS(Date.parse(execution.get('updated_at'))));
