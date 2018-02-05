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

import { List, Map, Record } from 'immutable';

export const ParametersDefaultState = Record({
  loaded: false,
  isFetching: false,
  isUpdating: false,
  form: Map({
    formErrors: List(),
    formFieldErrors: Map()
  }),
  resources: Map(),
  parameters: Map(),
  mistralParameters: Map()
});

export const Parameter = Record({
  default: undefined,
  description: undefined,
  label: undefined,
  name: undefined,
  noEcho: undefined,
  type: 'string',
  value: undefined
});

export const Resource = Record({
  description: undefined,
  id: undefined,
  name: undefined,
  resources: List(),
  parameters: List(),
  type: undefined
});
