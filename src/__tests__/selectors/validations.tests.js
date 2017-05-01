import { List, Map, OrderedMap } from 'immutable';

import * as selectors from '../../js/selectors/validations';
import { Validation } from '../../js/immutableRecords/validations';
import { CurrentPlanState } from '../../js/immutableRecords/currentPlan';
import {
  WorkflowExecution
} from '../../js/immutableRecords/workflowExecutions';
import MistralConstants from '../../js/constants/MistralConstants';

describe(' validations selectors', () => {
  const state = {
    currentPlan: new CurrentPlanState({
      conflict: undefined,
      currentPlanName: 'overcloud'
    }),
    validations: Map({
      validationsLoaded: true,
      isFetching: false,
      validations: Map({
        '512e': new Validation({
          description: '',
          groups: List(['pre-deployment']),
          id: '512e',
          metadata: Map(),
          name: 'Advanced Format 512e Support',
          results: Map(),
          status: undefined,
          stateInfo: undefined
        }),
        'check-network-gateway': new Validation({
          description: '',
          groups: List(['pre-deployment']),
          id: 'check-network-gateway',
          metadata: Map(),
          name: 'Check network_gateway on the provisioning network',
          results: Map(),
          status: undefined,
          stateInfo: undefined
        })
      })
    }),
    executions: Map({
      executionsLoaded: true,
      isFetchingExecutions: false,
      executions: OrderedMap({
        '1a': new WorkflowExecution({
          description: '',
          id: '1a',
          input: Map({
            validation_name: 'check-network-gateway',
            queue_name: 'tripleo',
            plan: 'overcloud'
          }),
          output: Map({
            stderr: '',
            plan: 'overcloud',
            stdout: '',
            validation_name: 'check-network-gateway',
            status: 'FAILED',
            queue_name: 'tripleo'
          }),
          params: Map({}),
          state: 'SUCCESS',
          state_info: null,
          updated_at: 1468905005000,
          workflow_name: MistralConstants.VALIDATIONS_RUN
        }),
        '2a': new WorkflowExecution({
          description: '',
          id: '2a',
          input: Map({
            validation_name: 'check-network-gateway',
            queue_name: 'tripleo',
            plan: 'overcloud'
          }),
          output: Map({
            stderr: '',
            plan: 'overcloud',
            stdout: '',
            validation_name: 'check-network-gateway',
            status: 'SUCCESS',
            queue_name: 'tripleo'
          }),
          params: Map({}),
          state: 'SUCCESS',
          state_info: null,
          updated_at: 1468905005001,
          workflow_name: MistralConstants.VALIDATIONS_RUN
        })
      })
    })
  };

  it('provides selector to get validation executions for current plan', () => {
    expect(selectors.getValidationExecutionsForCurrentPlan(state).size).toEqual(
      2
    );
    expect(selectors.getValidationExecutionsForCurrentPlan(state)).toEqual(
      state.executions.get('executions')
    );
  });

  it('provides selector to get validation combined with its results', () => {
    const validationsWithResults = selectors.getValidationsWithResults(state);
    expect(validationsWithResults.size).toEqual(2);
    expect(validationsWithResults.get('512e').results.size).toEqual(0);
    expect(validationsWithResults.get('512e').status).toEqual('new');
    expect(
      validationsWithResults.get('check-network-gateway').results.size
    ).toEqual(2);
    expect(validationsWithResults.get('check-network-gateway').status).toEqual(
      'success'
    );
  });
});
