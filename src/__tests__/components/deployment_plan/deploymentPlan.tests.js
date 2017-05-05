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

import { List, Map } from 'immutable';

import { InitialPlanState } from '../../../js/immutableRecords/plans';
import { CurrentPlanState } from '../../../js/immutableRecords/currentPlan';
import {
  ParametersDefaultState
} from '../../../js/immutableRecords/parameters';
import { RolesState } from '../../../js/immutableRecords/roles';
import { StacksState } from '../../../js/immutableRecords/stacks';
import {
  EnvironmentConfigurationState
} from '../../../js/immutableRecords/environmentConfiguration';
import {
  mapStateToProps
} from '../../../js/components/deployment_plan/DeploymentPlan.js';

describe('DeploymentPlan mapStateToProps', () => {
  describe('hasPlans flag', () => {
    it('returns ``hasPlans`` as `false`', () => {
      let props = mapStateToProps({
        currentPlan: new CurrentPlanState(),
        parameters: new ParametersDefaultState(),
        plans: new InitialPlanState({ all: List() }),
        stacks: new StacksState(),
        roles: new RolesState({
          loaded: false,
          isFetching: false,
          roles: Map()
        }),
        nodes: Map({
          isFetching: false,
          all: Map()
        }),
        environmentConfiguration: new EnvironmentConfigurationState(),
        validations: Map()
      });
      expect(props.hasPlans).toBe(false);
    });
    it('returns ``hasPlans`` as `true`', () => {
      let props = mapStateToProps({
        currentPlan: new CurrentPlanState(),
        parameters: new ParametersDefaultState(),
        plans: new InitialPlanState({ all: List(['foo', 'bar']) }),
        stacks: new StacksState(),
        roles: new RolesState({
          loaded: false,
          isFetching: false,
          roles: Map()
        }),
        nodes: Map({
          isFetching: false,
          all: Map()
        }),
        environmentConfiguration: new EnvironmentConfigurationState(),
        validations: Map()
      });
      expect(props.hasPlans).toBe(true);
    });
  });
});
