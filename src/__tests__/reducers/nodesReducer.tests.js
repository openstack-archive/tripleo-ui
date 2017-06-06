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

import { fromJS, Map, Set } from 'immutable';

import NodesConstants from '../../js/constants/NodesConstants';
import nodesReducer from '../../js/reducers/nodesReducer';
import { NodesState } from '../../js/immutableRecords/nodes';

describe('nodesReducer', () => {
  const initialState = new NodesState({
    isFetching: false,
    nodesInProgress: Set(),
    all: Map(),
    ports: Map(),
    introspectionStatuses: Map(),
    introspectionData: Map()
  });

  const updatedState = new NodesState({
    isFetching: false,
    nodesInProgress: Set(),
    all: Map({
      uuid1: Map({
        uuid: 'uuid1'
      }),
      uuid2: Map({
        uuid: 'uuid2'
      })
    }),
    ports: Map(),
    introspectionStatuses: Map(),
    introspectionData: Map()
  });

  const updatedNodeState = new NodesState({
    isFetching: false,
    nodesInProgress: Set(),
    all: Map({
      uuid1: Map({
        uuid: 'uuid1',
        properties: Map({
          capabilities: 'boot_option:local'
        })
      }),
      uuid2: Map({
        uuid: 'uuid2'
      })
    }),
    ports: Map(),
    introspectionStatuses: Map(),
    introspectionData: Map()
  });

  it('should return initial state', () => {
    expect(nodesReducer(initialState, {})).toEqual(initialState);
  });

  it('should handle UPDATE_NODE_PENDING', () => {
    const action = {
      type: NodesConstants.UPDATE_NODE_PENDING,
      payload: 'uuid1'
    };
    const newState = nodesReducer(initialState, action);
    expect(newState.get('nodesInProgress')).toEqual(Set(['uuid1']));
  });

  it('should handle UPDATE_NODE_SUCCESS', () => {
    const action = {
      type: NodesConstants.UPDATE_NODE_SUCCESS,
      payload: {
        uuid: 'uuid1',
        properties: {
          capabilities: 'boot_option:local'
        }
      }
    };
    const newState = nodesReducer(updatedState, action);
    expect(newState.get('all')).toEqual(updatedNodeState.get('all'));
    expect(newState.get('nodesInProgress')).toEqual(Set());
  });

  it('should handle UPDATE_NODE_FAILED', () => {
    const action = {
      type: NodesConstants.UPDATE_NODE_FAILED,
      payload: 'uuid1'
    };
    const newState = nodesReducer(updatedState, action);
    expect(newState).toEqual(updatedState);
    expect(newState.get('nodesInProgress')).toEqual(Set());
  });

  it('should handle DELETE_NODE_SUCCESS', () => {
    const action = {
      type: NodesConstants.DELETE_NODE_SUCCESS,
      payload: 'uuid1'
    };
    const newState = nodesReducer(updatedState, action);
    expect(newState.get('all').size).toEqual(1);
    expect(newState.get('nodesInProgress')).toEqual(Set());
  });

  it('should handle DELETE_NODE_FAILED', () => {
    const action = {
      type: NodesConstants.UPDATE_NODE_FAILED,
      payload: 'uuid1'
    };
    const newState = nodesReducer(updatedState, action);
    expect(newState).toEqual(updatedState);
    expect(newState.get('nodesInProgress')).toEqual(Set());
  });

  it('should handle ADD_NODES action', () => {
    const registeredNodes = {
      uuid1: {
        uuid: 'uuid1'
      },
      uuid2: {
        uuid: 'uuid2'
      }
    };
    const action = {
      type: NodesConstants.ADD_NODES,
      payload: registeredNodes
    };
    const newState = nodesReducer(initialState, action);
    expect(newState).toEqual(updatedState);
  });

  it('should handle FETCH_NODE_INTROSPECTION_DATA_SUCCESS action', () => {
    const action = {
      type: NodesConstants.FETCH_NODE_INTROSPECTION_DATA_SUCCESS,
      payload: {
        nodeId: 'uuid1',
        data: { interfaces: { eth0: { mac: '00:00:00:00:00:11' } } }
      }
    };
    const newState = nodesReducer(updatedState, action);
    expect(newState.introspectionData.get('uuid1')).toEqual(
      fromJS(action.payload.data)
    );
  });

  it('should handle FETCH_NODE_INTROSPECTION_DATA_FAILED action', () => {
    const action = {
      type: NodesConstants.FETCH_NODE_INTROSPECTION_DATA_FAILED,
      payload: 'uuid1'
    };
    const newState = nodesReducer(updatedState, action);
    expect(newState.introspectionData.get('uuid1')).toEqual(undefined);
  });
});
