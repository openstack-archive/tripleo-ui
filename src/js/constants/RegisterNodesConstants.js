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
  ADD_NODE: null,
  SELECT_NODE: null,
  REMOVE_NODE: null,
  UPDATE_NODE: null,
  START_NODES_REGISTRATION_PENDING: null,
  START_NODES_REGISTRATION_SUCCESS: null,
  START_NODES_REGISTRATION_FAILED: null,
  NODES_REGISTRATION_SUCCESS: null,
  NODES_REGISTRATION_FAILED: null,
  CANCEL_NODES_REGISTRATION: null
});
