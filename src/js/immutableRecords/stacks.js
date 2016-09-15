import { List, Map, Record } from 'immutable';

export const StacksState = Record({
  isLoaded: false,
  isFetching: false,
  stacks: Map(),
  resources: Map()
});

export const Stack = Record({
  creation_time: undefined,
  deletion_time: undefined,
  description: undefined,
  environment: Map(),
  id: undefined,
  parent: undefined,
  resources: Map(),
  stack_name: undefined,
  stack_owner: undefined,
  stack_status: undefined,
  stack_status_reason: undefined,
  stack_user_project_id: undefined,
  tags: Map(),
  updated_time: undefined
});

export const StackResource = Record({
  attributes: undefined,
  creation_time: undefined,
  links: List(),
  logical_resource_id: undefined,
  physical_resource_id: undefined,
  required_by: List(),
  resource_name: undefined,
  resource_status: undefined,
  resource_status_reason: undefined,
  resource_type: undefined,
  updated_time: undefined
});
