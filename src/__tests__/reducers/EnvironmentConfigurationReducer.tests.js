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

import { Map, fromJS } from 'immutable';

import * as EnvironmentConfigurationActions from '../../js/actions/EnvironmentConfigurationActions';
import EnvironmentConfigurationConstants from '../../js/constants/EnvironmentConfigurationConstants';
import environmentConfigurationReducer from '../../js/reducers/environmentConfigurationReducer';
import { EnvironmentConfigurationState } from '../../js/immutableRecords/environmentConfiguration';

const initialState = new EnvironmentConfigurationState();

describe('environmentConfigurationReducer', () => {
  describe('default state', () => {
    let state;

    beforeEach(() => {
      state = environmentConfigurationReducer(initialState, {
        type: 'undefined-action'
      });
    });

    it('`isFetching` is false', () => {
      expect(state.get('isFetching')).toBe(false);
    });
    it('`topics` is an empty Map', () => {
      expect(state.get('topics')).toEqual(Map());
    });
    it('`environmentGroups` is an empty Map', () => {
      expect(state.get('environmentGroups')).toEqual(Map());
    });
    it('`environments` is an empty Map', () => {
      expect(state.get('environments')).toEqual(Map());
    });
  });

  describe('fetchEnvironmentConfigurationPending', () => {
    let newState;
    let action = {
      type:
        EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_CONFIGURATION_PENDING
    };

    beforeEach(() => {
      newState = environmentConfigurationReducer(initialState, action);
    });

    it('resets the state to initialState and starts loading', () => {
      expect(newState.isFetching).toBe(true);
      expect(newState.topics).toEqual(initialState.topics);
      expect(newState.form).toEqual(initialState.form);
    });
  });

  describe('fetchEnvironmentConfigurationSuccess', () => {
    let state;
    let payload = { topics: ['bar'] };

    beforeEach(() => {
      state = environmentConfigurationReducer(
        initialState,
        EnvironmentConfigurationActions.fetchEnvironmentConfigurationSuccess(
          payload
        )
      );
    });

    it('sets `loaded` to true', () => {
      expect(state.loaded).toBe(true);
    });

    it('sets `isFetching` to false', () => {
      expect(state.isFetching).toBe(false);
    });

    it('sets ``topics``', () => {
      expect(state.get('topics')).toEqual(fromJS(payload.topics));
    });
    it('sets ``environmentGroups`` to empty Map if payload does not include them', () => {
      expect(state.get('environmentGroups')).toEqual(Map());
    });
    it('sets ``environments`` to empty Map if payload does not include them', () => {
      expect(state.get('environments')).toEqual(Map());
    });
  });
});
