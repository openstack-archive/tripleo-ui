import { fromJS, Map } from 'immutable';
import { kebabCase, startCase } from 'lodash';

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
    // Convert roles array into Map of Role records. This could get replaced by normalizing
    // once the mistral getRoles action returns an array of objects
    const roles = fromJS(action.payload)
                    .reduce((result, role) => result.set(_getRoleIdentifier(role),
                                                         _createRole(role)), Map());

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

const _createRole = (roleName) => {
  return new Role({
    name: roleName,
    title: startCase(roleName),
    identifier: _getRoleIdentifier(roleName)
  });
};

// TODO(jtomasek): Controller role name and tag don't follow naming concention
// Rremove this after controller tag is renamed from control to controller
const _getRoleIdentifier = roleName => {
  if (roleName === 'Controller') {
    return 'control';
  }
  return kebabCase(roleName);
};
