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

import { startSubmit } from 'redux-form';
import yaml from 'js-yaml';

import MistralApiService from '../../js/services/MistralApiService';
import MistralConstants from '../../js/constants/MistralConstants';
import { mockStore } from './utils';
import * as PlansActions from '../../js/actions/PlansActions';
import SwiftApiService from '../../js/services/SwiftApiService';
import storage from '../mocks/storage';
import * as WorkflowActions from '../../js/actions/WorkflowActions';

window.localStorage = window.sessionStorage = storage;

describe('PlansActions', () => {
  describe('updatePlan', () => {
    const store = mockStore({});
    const execution = {
      id: 'some-uuid'
    };

    beforeEach(() => {
      MistralApiService.runWorkflow = jest
        .fn()
        .mockReturnValue(() => Promise.resolve());
      SwiftApiService.createObject = jest
        .fn()
        .mockReturnValue(() => Promise.resolve());
      WorkflowActions.startWorkflow = jest
        .fn()
        .mockReturnValue(() => Promise.resolve(execution));
    });

    it('dispatches actions', () =>
      store
        .dispatch(
          PlansActions.updatePlan('somecloud', {
            someFile: { contents: 'file contents' }
          })
        )
        .then(() => {
          expect(WorkflowActions.startWorkflow).toHaveBeenCalledWith(
            MistralConstants.PLAN_UPDATE,
            {
              container: 'somecloud'
            },
            expect.any(Function),
            2 * 60 * 1000
          );
          expect(store.getActions()).toEqual([
            startSubmit('editPlanForm'),
            PlansActions.updatePlanPending('somecloud')
          ]);
        }));
  });

  describe('createPlan', () => {
    const store = mockStore({});
    const execution = {
      id: 'some-uuid'
    };

    beforeEach(() => {
      MistralApiService.runAction = jest
        .fn()
        .mockReturnValue(() => Promise.resolve());
      WorkflowActions.startWorkflow = jest
        .fn()
        .mockReturnValue(() => Promise.resolve(execution));
    });

    it('dispatches actions', () =>
      store.dispatch(PlansActions.createPlan('somecloud', {})).then(() => {
        expect(WorkflowActions.startWorkflow).toHaveBeenCalledWith(
          MistralConstants.PLAN_CREATE,
          {
            container: 'somecloud'
          },
          expect.any(Function),
          2 * 60 * 1000
        );
        expect(store.getActions()).toEqual([startSubmit('newPlanForm')]);
      }));
  });

  describe('createDefaultPlan', () => {
    const store = mockStore({});
    const execution = {
      id: 'some-uuid'
    };

    beforeEach(() => {
      WorkflowActions.startWorkflow = jest
        .fn()
        .mockReturnValue(() => Promise.resolve(execution));
    });

    it('dispatches actions', () =>
      store.dispatch(PlansActions.createDefaultPlan('somecloud')).then(() => {
        expect(WorkflowActions.startWorkflow).toHaveBeenCalledWith(
          MistralConstants.PLAN_CREATE,
          {
            container: 'somecloud',
            use_default_templates: true
          },
          expect.any(Function),
          2 * 60 * 1000
        );
        expect(store.getActions()).toEqual([startSubmit('newPlanForm')]);
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
      store.dispatch(PlansActions.deletePlan('somecloud')).then(() => {
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
    beforeEach(() => {
      MistralApiService.runAction = jest
        .fn()
        .mockReturnValue(() => Promise.resolve(apiResponseMistral));
    });

    it('dispatches actions', () =>
      store.dispatch(PlansActions.fetchPlans()).then(() => {
        expect(MistralApiService.runAction).toHaveBeenCalledWith(
          MistralConstants.PLAN_LIST
        );
        expect(store.getActions()).toEqual([
          PlansActions.fetchPlansPending(),
          PlansActions.fetchPlansSuccess(apiResponseMistral)
        ]);
      }));
  });

  describe('fetchPlanDetails', () => {
    const store = mockStore({});
    const planEnvironment = { description: 'Description' };

    beforeEach(() => {
      SwiftApiService.getObject = jest
        .fn()
        .mockReturnValue(() => Promise.resolve(yaml.safeDump(planEnvironment)));
      yaml.safeLoad = jest.fn().mockReturnValue(planEnvironment);
    });

    it('dispatches actions', () =>
      store.dispatch(PlansActions.fetchPlanDetails('overcloud')).then(() => {
        expect(SwiftApiService.getObject).toHaveBeenCalled();
        expect(store.getActions()).toEqual([
          PlansActions.fetchPlanDetailsPending('overcloud'),
          PlansActions.fetchPlanDetailsSuccess('overcloud', planEnvironment)
        ]);
      }));
  });

  describe('fetchPlanFiles', () => {
    const store = mockStore({});
    let apiResponse = [
      { name: 'overcloud.yaml' },
      { name: 'capabilities_map.yaml' }
    ];

    beforeEach(() => {
      SwiftApiService.getContainer = jest
        .fn()
        .mockReturnValue(() => Promise.resolve(apiResponse));
    });

    it('dispatches actions', () =>
      store.dispatch(PlansActions.fetchPlanFiles('overcloud')).then(() => {
        expect(SwiftApiService.getContainer).toHaveBeenCalled();
        expect(store.getActions()).toEqual([
          PlansActions.fetchPlanFilesPending('overcloud'),
          PlansActions.fetchPlanFilesSuccess('overcloud', apiResponse)
        ]);
      }));
  });
});
