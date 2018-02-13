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

import keyMirror from 'keymirror';

export default keyMirror({
  FETCH_PARAMETERS_PENDING: null,
  FETCH_PARAMETERS_SUCCESS: null,
  FETCH_PARAMETERS_FAILED: null,
  UPDATE_PARAMETERS_SUCCESS: null
});

// List of parameter names which are considered internal and should not be displayed by GUI
// TODO(jtomasek): these should be ideally identified using ParameterGroup in THT
export const internalParameters = [
  'DefaultPasswords',
  'EndpointMap',
  'ServiceNetMap'
];
