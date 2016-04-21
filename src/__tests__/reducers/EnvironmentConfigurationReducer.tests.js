import { Map, fromJS } from 'immutable';

import EnvironmentConfigurationActions from '../../js/actions/EnvironmentConfigurationActions';
import EnvironmentConfigurationConstants
  from '../../js/constants/EnvironmentConfigurationConstants';
import environmentConfigurationReducer from '../../js/reducers/environmentConfigurationReducer';
import { InitialEnvironmentConfigurationState }
  from '../../js/immutableRecords/environmentConfiguration';

const initialState = new InitialEnvironmentConfigurationState;

describe('environmentConfigurationReducer', () => {
  describe('default state', () => {
    let state;

    beforeEach(() => {
      state = environmentConfigurationReducer(initialState, {type: 'undefined-action'});
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
      type: EnvironmentConfigurationConstants.FETCH_ENVIRONMENT_CONFIGURATION_PENDING
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
        EnvironmentConfigurationActions.fetchEnvironmentConfigurationSuccess(payload)
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
