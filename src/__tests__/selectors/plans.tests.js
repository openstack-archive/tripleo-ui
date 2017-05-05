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

import { Map } from 'immutable';

import { Plan } from '../../js/immutableRecords/plans';
import { getAllPlansButCurrent } from '../../js/selectors/plans';
import { InitialPlanState } from '../../js/immutableRecords/plans';
import { CurrentPlanState } from '../../js/immutableRecords/currentPlan';

describe('plans selectors', () => {
  describe('getAllPlansButCurrent()', () => {
    const state = {
      plans: new InitialPlanState({
        isFetchingPlans: false,
        all: Map({
          plan1: new Plan({
            name: 'plan1',
            transition: false,
            files: Map()
          }),
          plan2: new Plan({
            name: 'plan2',
            transition: false,
            files: Map()
          })
        })
      }),
      currentPlan: new CurrentPlanState({
        conflict: undefined,
        currentPlanName: 'plan1'
      })
    };

    it('provides selector to list all Plans except for the currently selected one', () => {
      expect(getAllPlansButCurrent(state).size).toEqual(1);
      expect(getAllPlansButCurrent(state).first().name).toEqual('plan2');
    });
  });
});
