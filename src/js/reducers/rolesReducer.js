import { fromJS, Map } from 'immutable';

import PlansConstants from '../constants/PlansConstants';
import RolesConstants from '../constants/RolesConstants';
import { Role } from '../immutableRecords/roles';

const initialState = Map({
  loaded: false,
  isFetching: false,
  roles: Map()
});

export default function rolesReducer(state = initialState, action) {

  switch(action.type) {

  case RolesConstants.FETCH_ROLES_PENDING:
    return state.set('isFetching', true);

  case RolesConstants.FETCH_ROLES_SUCCESS: {
    const roles = action.payload || {};
    return state.set('roles', fromJS(roles).map(role => new Role(role)))
                .set('isFetching', false)
                .set('loaded', true);
  }

  case RolesConstants.FETCH_ROLES_FAILED:
    return state.set('roles', Map())
                .set('isFetching', false)
                .set('loaded', true);

  case PlansConstants.PLAN_CHOSEN:
    return state.set('loaded', false);

  default:
    return state;

  }
}
