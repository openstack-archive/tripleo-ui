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

import MistralApiService from '../../js/services/MistralApiService';
import { mockStore } from './utils';
import mockHistory from '../mocks/history';
import PlansActions from '../../js/actions/PlansActions';
import SwiftApiService from '../../js/services/SwiftApiService';
import storage from '../mocks/storage';

window.localStorage = window.sessionStorage = storage;

describe('PlansActions', () => {
  describe('updatePlan', () => {
    const store = mockStore({});

    beforeEach(() => {
      MistralApiService.runWorkflow = jest
        .fn()
        .mockReturnValue(() => Promise.resolve());
      SwiftApiService.createObject = jest
        .fn()
        .mockReturnValue(() => Promise.resolve());
    });

    it('dispatches actions', () =>
      store
        .dispatch(
          PlansActions.updatePlan('somecloud', {
            someFile: { contents: 'file contents' }
          })
        )
        .then(() => {
          expect(MistralApiService.runWorkflow).toHaveBeenCalled();
          expect(store.getActions()).toEqual([
            PlansActions.updatePlanPending('somecloud')
          ]);
        }));
  });

  describe('createPlan', () => {
    const store = mockStore({});

    beforeEach(() => {
      MistralApiService.runAction = jest
        .fn()
        .mockReturnValue(() => Promise.resolve());
      MistralApiService.runWorkflow = jest
        .fn()
        .mockReturnValue(() => Promise.resolve());
      SwiftApiService.createObject = jest
        .fn()
        .mockReturnValue(() => Promise.resolve());
    });

    it('dispatches actions', () =>
      store.dispatch(PlansActions.createPlan('somecloud', {})).then(() => {
        expect(store.getActions()).toEqual([PlansActions.createPlanPending()]);
      }));
  });

  describe('deletePlans', () => {
    const store = mockStore({});

    beforeEach(() => {
      MistralApiService.runAction = jest
        .fn()
        .mockReturnValue(() => Promise.resolve());
    });

    it('dispatches actions', () =>
      store
        .dispatch(PlansActions.deletePlan('somecloud', mockHistory))
        .then(() => {
          expect(store.getActions().map(action => action.type)).toEqual([
            'DELETE_PLAN_PENDING',
            'DELETE_PLAN_SUCCESS',
            'NOTIFY'
          ]);
        }));
  });

  describe('fetchPlans', () => {
    const store = mockStore({});
    const apiResponseMistral = ['overcloud', 'another-cloud'];
    const expectedPlans = [
      { name: 'overcloud', description: 'Default deployment plan' },
      { name: 'another-cloud', description: 'My custom plan' }
    ];

    beforeEach(() => {
      SwiftApiService.getObject = jest
        .fn()
        .mockReturnValueOnce(() =>
          Promise.resolve(
            'name: overcloud\ndescription: Default deployment plan'
          )
        )
        .mockReturnValueOnce(() =>
          Promise.resolve('name: another-cloud\ndescription: My custom plan')
        );
      MistralApiService.runAction = jest
        .fn()
        .mockReturnValue(() => Promise.resolve(apiResponseMistral));
    });

    it('dispatches actions', () =>
      store.dispatch(PlansActions.fetchPlans()).then(() => {
        expect(MistralApiService.runAction).toHaveBeenCalled();
        expect(store.getActions()).toEqual([
          PlansActions.requestPlans(),
          PlansActions.receivePlans(expectedPlans)
        ]);
      }));
  });

  describe('fetchPlan', () => {
    const store = mockStore({});
    let apiResponse = [
      { name: 'overcloud.yaml' },
      { name: 'capabilities_map.yaml' }
    ];
    const normalizedResponse = {
      'overcloud.yaml': { name: 'overcloud.yaml' },
      'capabilities_map.yaml': { name: 'capabilities_map.yaml' }
    };

    beforeEach(() => {
      SwiftApiService.getContainer = jest
        .fn()
        .mockReturnValue(() => Promise.resolve(apiResponse));
    });

    it('dispatches actions', () =>
      store.dispatch(PlansActions.fetchPlan('overcloud')).then(() => {
        expect(SwiftApiService.getContainer).toHaveBeenCalled();
        expect(store.getActions()).toEqual([
          PlansActions.requestPlan(),
          PlansActions.receivePlan('overcloud', normalizedResponse)
        ]);
      }));
  });
});
