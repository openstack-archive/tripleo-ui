import { List, Map, Record } from 'immutable';

export const NodeToRegister = Record({
  id: undefined,
  name: '',
  nicMacAddresses: List(),
  driver: 'pxe_ssh',
  driver_info: Map(),
  valid: false
});

export const IronicNode = Record({
  name: '',
  nicMacAddresses: List(),
  driver: 'pxe_ssh',
  driver_info: Map()
});
