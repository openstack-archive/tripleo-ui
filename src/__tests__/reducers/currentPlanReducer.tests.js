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

import { CurrentPlanState } from '../../js/immutableRecords/currentPlan';
import currentPlanReducer from '../../js/reducers/currentPlanReducer';
import CurrentPlanActions from '../../js/actions/CurrentPlanActions';

describe('plansReducer state', () => {
  describe('default state', () => {
    let state;

    beforeEach(() => {
      state = currentPlanReducer(undefined, { type: 'undefined-action' });
    });

    it('`conflict` is undefined', () => {
      expect(state.get('conflict')).not.toBeDefined();
    });

    it('`currentPlanName` is undefined', () => {
      expect(state.get('currentPlanName')).not.toBeDefined();
    });
  });

  describe('PLAN_CHOSEN', () => {
    let state;

    beforeEach(() => {
      state = currentPlanReducer(
        new CurrentPlanState(),
        CurrentPlanActions.planChosen('another-cloud')
      );
    });

    it('sets the current planName', () => {
      expect(state.get('currentPlanName')).toEqual('another-cloud');
    });
  });
});
