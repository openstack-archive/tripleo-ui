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

import { List, Map, OrderedMap } from 'immutable';

import * as selectors from '../../js/selectors/validations';
import { Validation } from '../../js/immutableRecords/validations';
import {
  ActiveFilter,
  FiltersInitialState
} from '../../js/immutableRecords/filters';
import { InitialPlanState, Plan } from '../../js/immutableRecords/plans';
import {
  WorkflowExecution
} from '../../js/immutableRecords/workflowExecutions';
import MistralConstants from '../../js/constants/MistralConstants';

describe(' validations selectors', () => {
  let state;
  beforeEach(() => {
    state = {
      plans: new InitialPlanState({
        currentPlanName: 'overcloud',
        plansLoaded: true,
        all: Map({
          overcloud: new Plan({
            name: 'overcloud'
          })
        })
      }),
      filters: FiltersInitialState(),
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
          }),
          'foo-validation': new Validation({
            description: '',
            groups: List(['post-deployment']),
            id: 'foo-validation',
            metadata: Map(),
            name: 'Foo Validation',
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
              validation_name: 'check-netmork-gateway',
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
  });

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
    expect(validationsWithResults.size).toEqual(3);
    expect(validationsWithResults.get('512e').results.size).toEqual(0);
    expect(validationsWithResults.get('512e').status).toEqual('new');
    expect(
      validationsWithResults.get('check-network-gateway').results.size
    ).toEqual(2);
    expect(validationsWithResults.get('check-network-gateway').status).toEqual(
      'success'
    );
  });

  describe('getFilteredValidations selector', () => {
    it('returns all validations if no filters are set', () => {
      expect(selectors.getFilteredValidations(state).size).toEqual(3);
    });

    it('filters validations by name', () => {
      state.filters = FiltersInitialState({
        validationsToolbar: Map({
          activeFilters: Map({
            fake_id_1: ActiveFilter({
              uuid: 'fake_id_1',
              filterBy: 'name',
              filterString: '512'
            })
          }),
          sortBy: 'name',
          sortDir: 'asc',
          contentView: 'list'
        })
      });
      const filtered = selectors.getFilteredValidations(state);
      expect(filtered.size).toEqual(1);
      expect(filtered.get('512e')).toBeDefined();
    });

    it('filters validations by group', () => {
      state.filters = FiltersInitialState({
        validationsToolbar: Map({
          activeFilters: Map({
            fake_id_1: ActiveFilter({
              uuid: 'fake_id_1',
              filterBy: 'group',
              filterString: 'post-deployment'
            })
          }),
          sortBy: 'name',
          sortDir: 'asc',
          contentView: 'list'
        })
      });
      const filtered = selectors.getFilteredValidations(state);
      expect(filtered.size).toEqual(1);
      expect(filtered.get('foo-validation')).toBeDefined();
    });

    it('filters validations by name and group', () => {
      state.filters = FiltersInitialState({
        validationsToolbar: Map({
          activeFilters: Map({
            fake_id_1: ActiveFilter({
              uuid: 'fake_id_1',
              filterBy: 'group',
              filterString: 'pre-deployment'
            }),
            fake_id_2: ActiveFilter({
              uuid: 'fake_id_2',
              filterBy: 'name',
              filterString: 'network_gateway'
            })
          }),
          sortBy: 'name',
          sortDir: 'asc',
          contentView: 'list'
        })
      });
      const filtered = selectors.getFilteredValidations(state);
      expect(filtered.size).toEqual(1);
      expect(filtered.get('check-network-gateway')).toBeDefined();
    });
  });

  describe('getMostRecentPlanUpdate', () => {
    it('returns 0 if there are no executions', () => {
      const executions = Map({});
      expect(
        selectors.getMostRecentPlanUpdate(executions, 'overcloud')
      ).toEqual(0);
    });

    it('returns 0 if there are no relevant executions', () => {
      const executions = Map({
        one: Map({
          workflow_name: 'tripleo.baremetal.v1.introspect',
          updated_at: 1504686886000
        })
      });
      expect(
        selectors.getMostRecentPlanUpdate(executions, 'overcloud')
      ).toEqual(0);
    });

    it('returns the most recent update time', () => {
      const executions = Map({
        one: Map({
          workflow_name: 'tripleo.baremetal.v1.introspect',
          updated_at: 1500000000007
        }),
        two: Map({
          workflow_name: 'tripleo.plan_management.v1.create_deployment_plan',
          updated_at: 1500000000004,
          input: Map({ container: 'overcloud' })
        }),
        three: Map({
          workflow_name: 'tripleo.plan_management.v1.update_deployment_plan',
          updated_at: 1500000000003,
          input: Map({ container: 'overcloud' })
        }),
        four: Map({
          workflow_name: 'tripleo.plan_management.v1.delete_deployment_plan',
          updated_at: 1500000000006,
          input: Map({ container: 'overcloud' })
        }),
        five: Map({
          workflow_name: 'tripleo.plan_management.v1.update_deployment_plan',
          updated_at: 1500000000005,
          input: Map({ container: 'another-cloud' })
        })
      });
      expect(
        selectors.getMostRecentPlanUpdate(executions, 'overcloud')
      ).toEqual(1500000000004);
    });
  });
});
