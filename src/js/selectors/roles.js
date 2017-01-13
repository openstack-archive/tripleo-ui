import { Role } from '../immutableRecords/roles';

export const getRoles = (state) => state.roles.roles.sortBy(r => r.name.toLowerCase());
export const getRole = (state, roleIdentifier) =>
  state.roles.get('roles').get(roleIdentifier, new Role());
