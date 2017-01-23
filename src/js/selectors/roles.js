import { Role } from '../immutableRecords/roles';

export const getRole = (state, roleIdentifier) =>
  state.roles.get('roles').get(roleIdentifier, new Role());
export const roles = state => state.roles.get('roles');
