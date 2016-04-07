import matchers from 'jasmine-immutable-matchers';
import { Map } from 'immutable';

import { Role } from '../../js/immutableRecords/roles';
import PlansConstants from '../../js/constants/PlansConstants';
import RolesConstants from '../../js/constants/RolesConstants';
import rolesReducer from '../../js/reducers/rolesReducer';

describe('rolesReducer', () => {
  beforeEach(() => {
    jasmine.addMatchers(matchers);
  });

  const initialState = Map({
    loaded: false,
    isFetching: false,
    roles: Map()
  });

  const updatedState = Map({
    loaded: true,
    isFetching: false,
    roles: Map({
      control: new Role({
        title: 'Controller',
        name: 'control'
      })
    })
  });

  it('should return initial state', () => {
    expect(rolesReducer(initialState, {})).toEqual(initialState);
  });

  it('should handle FETCH_ROLES_PENDING', () => {
    const action = {
      type: RolesConstants.FETCH_ROLES_PENDING
    };
    const newState = rolesReducer(initialState, action);
    expect(newState.get('isFetching')).toEqual(true);
  });

  it('should handle FETCH_ROLES_SUCCESS', () => {
    const action = {
      type: RolesConstants.FETCH_ROLES_SUCCESS,
      payload: {
        control: {
          name: 'control',
          title: 'Controller'
        }
      }
    };
    const newState = rolesReducer(initialState, action);
    expect(newState.get('roles')).toEqualImmutable(
      updatedState.get('roles')
    );
    expect(newState.get('loaded')).toEqual(true);
  });

  it('should handle FETCH_ROLES_FAILED', () => {
    const action = {
      type: RolesConstants.FETCH_ROLES_FAILED
    };
    const newState = rolesReducer(initialState, action);
    expect(newState.get('loaded')).toEqual(true);
    expect(newState.get('roles')).toEqual(Map());
  });

  it('should handle PLAN_CHOSEN', () => {
    const action = {
      type: PlansConstants.PLAN_CHOSEN
    };
    const newState = rolesReducer(updatedState, action);
    expect(newState.get('loaded')).toEqual(false);
  });
});
