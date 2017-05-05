import { List, Record } from 'immutable';

export const NodeToRegister = Record({
  uuid: undefined,
  name: undefined,
  mac: List(),
  pm_type: 'pxe_ssh',
  pm_user: undefined,
  pm_addr: undefined,
  pm_password: undefined,
  pm_port: undefined,
  arch: undefined,
  cpu: undefined,
  memory: undefined,
  disk: undefined,
  valid: false
});

export const IronicNode = Record({
  // uuid: undefined, TODO(jtomasek): re-add this once registration supports passing uuid
  name: undefined,
  mac: List(),
  pm_type: 'pxe_ssh',
  pm_user: undefined,
  pm_addr: undefined,
  pm_password: undefined,
  pm_port: undefined,
  arch: undefined,
  cpu: undefined,
  memory: undefined,
  disk: undefined,
  capabilities: 'boot_option:local'
});

export const Port = Record({
  uuid: undefined,
  address: undefined
});
