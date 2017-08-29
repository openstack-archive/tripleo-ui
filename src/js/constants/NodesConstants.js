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

import keyMirror from 'keymirror'

export default keyMirror({
  REQUEST_NODES: null,
  RECEIVE_NODES: null,
  FETCH_NODE_MACS_SUCCESS: null,
  FETCH_NODE_INTROSPECTION_DATA_SUCCESS: null,
  FETCH_NODE_INTROSPECTION_DATA_FAILED: null,
  START_NODES_OPERATION: null,
  FINISH_NODES_OPERATION: null,
  UPDATE_NODE_PENDING: null,
  UPDATE_NODE_SUCCESS: null,
  UPDATE_NODE_FAILED: null,
  DELETE_NODE_SUCCESS: null,
  DELETE_NODE_FAILED: null,
  ADD_NODES: null
})
