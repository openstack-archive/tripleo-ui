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

import IronicApiService from '../../js/services/IronicApiService';
import IronicInspectorApiService from '../../js/services/IronicInspectorApiService';
import { mockStore } from './utils';
import NodesActions from '../../js/actions/NodesActions';
import * as ErrorActions from '../../js/actions/ErrorActions';
import NodesConstants from '../../js/constants/NodesConstants';
import MistralConstants from '../../js/constants/MistralConstants';
import * as WorkflowActions from '../../js/actions/WorkflowActions';

const mockGetNodesResponse = [{ uuid: 1 }, { uuid: 2 }];

describe('Nodes Actions', () => {
  it('creates action to request nodes', () => {
    const expectedAction = {
      type: NodesConstants.REQUEST_NODES
    };
    expect(NodesActions.requestNodes()).toEqual(expectedAction);
  });

  it('creates action to receive nodes', () => {
    const expectedAction = {
      type: NodesConstants.RECEIVE_NODES,
      payload: mockGetNodesResponse
    };
    expect(NodesActions.receiveNodes(mockGetNodesResponse)).toEqual(
      expectedAction
    );
  });

  it('creates action to notify that nodes operation started', () => {
    const expectedAction = {
      type: NodesConstants.START_NODES_OPERATION,
      payload: mockGetNodesResponse
    };
    expect(NodesActions.startOperation(mockGetNodesResponse)).toEqual(
      expectedAction
    );
  });

  it('creates action to notify that nodes operation finished', () => {
    const expectedAction = {
      type: NodesConstants.FINISH_NODES_OPERATION,
      payload: mockGetNodesResponse
    };
    expect(NodesActions.finishOperation(mockGetNodesResponse)).toEqual(
      expectedAction
    );
  });

  it('should create an action for pending Node update', () => {
    const expectedAction = {
      type: NodesConstants.UPDATE_NODE_PENDING,
      payload: 'someId'
    };
    expect(NodesActions.updateNodePending('someId')).toEqual(expectedAction);
  });

  it('should create an action for successful Node update', () => {
    const updatedNode = {
      uuid: 1
    };
    const expectedAction = {
      type: NodesConstants.UPDATE_NODE_SUCCESS,
      payload: updatedNode
    };
    expect(NodesActions.updateNodeSuccess(updatedNode)).toEqual(expectedAction);
  });

  it('should create an action for failed Node update', () => {
    const expectedAction = {
      type: NodesConstants.UPDATE_NODE_FAILED,
      payload: 'someNodeId'
    };
    expect(NodesActions.updateNodeFailed('someNodeId')).toEqual(expectedAction);
  });

  it('should create an action to add Nodes', () => {
    const registeredNodes = {
      uuid1: {
        uuid: 'uuid1',
        name: 'node1'
      },
      uuid2: {
        uuid: 'uuid2',
        name: 'node2'
      }
    };
    const expectedAction = {
      type: NodesConstants.ADD_NODES,
      payload: registeredNodes
    };
    expect(NodesActions.addNodes(registeredNodes)).toEqual(expectedAction);
  });
});

describe('Fetching Nodes Actions', () => {
  beforeEach(() => {
    IronicApiService.getNodes = jest
      .fn()
      .mockReturnValue(() => Promise.resolve({ nodes: [{ uuid: '123' }] }));
    IronicApiService.getPorts = jest.fn().mockReturnValue(() =>
      Promise.resolve({
        ports: [{ uuid: 'port1', address: 'mac', node_uuid: '123' }]
      })
    );
    IronicInspectorApiService.getIntrospectionStatuses = jest
      .fn()
      .mockReturnValue(() =>
        Promise.resolve({
          introspection: [{ uuid: 'node1', state: 'finished' }]
        })
      );
  });

  it('fetches the data and dispatches actions', () => {
    const store = mockStore({});
    const normalizedData = {
      nodes: {
        123: {
          uuid: '123'
        }
      },
      ports: {
        port1: {
          uuid: 'port1',
          address: 'mac',
          node_uuid: '123'
        }
      },
      introspectionStatuses: {
        node1: {
          uuid: 'node1',
          state: 'finished'
        }
      }
    };

    return store.dispatch(NodesActions.fetchNodes()).then(() => {
      expect(IronicApiService.getNodes).toHaveBeenCalled();
      expect(IronicApiService.getPorts).toHaveBeenCalled();
      expect(
        IronicInspectorApiService.getIntrospectionStatuses
      ).toHaveBeenCalled();

      expect(store.getActions()).toEqual([
        NodesActions.requestNodes(),
        NodesActions.receiveNodes(normalizedData)
      ]);
    });
  });
});

describe('Fetching Introspection data success', () => {
  const response = { interfaces: { eth0: { mac: '00:00:00:00:00:11' } } };
  const nodeId = '598612eb-f21b-435e-a868-7bb74e576cc2';
  const store = mockStore({});

  beforeEach(() => {
    IronicInspectorApiService.getIntrospectionData = jest
      .fn()
      .mockReturnValue(() => Promise.resolve(response));
  });

  it('dispatches fetchNodeIntrospectionDataSuccess', () =>
    store.dispatch(NodesActions.fetchNodeIntrospectionData(nodeId)).then(() => {
      expect(
        IronicInspectorApiService.getIntrospectionData
      ).toHaveBeenCalledWith(nodeId);
      expect(store.getActions()).toEqual([
        NodesActions.fetchNodeIntrospectionDataSuccess(nodeId, response)
      ]);
    }));
});

describe('Fetching Introspection data error', () => {
  const store = mockStore({});
  const nodeId = '598612eb-f21b-435e-a868-7bb74e576cc2';
  const error = {
    response: {
      data: { error: { message: 'some error message' } },
      status: 404
    }
  };

  beforeEach(() => {
    IronicInspectorApiService.getIntrospectionData = jest
      .fn()
      .mockReturnValue(() => Promise.reject(error));
    ErrorActions.handleErrors = jest.fn().mockReturnValue(() => {});
  });

  it('dispatches fetchNodeIntrospectionDataFailed', () =>
    store.dispatch(NodesActions.fetchNodeIntrospectionData(nodeId)).then(() => {
      expect(
        IronicInspectorApiService.getIntrospectionData
      ).toHaveBeenCalledWith(nodeId);
      expect(store.getActions()).toEqual([
        NodesActions.fetchNodeIntrospectionDataFailed(nodeId)
      ]);
    }));
});

describe('Asynchronous Introspect Nodes Action', () => {
  const store = mockStore({});
  const nodeIds = ['598612eb-f21b-435e-a868-7bb74e576cc2'];

  beforeEach(() => {
    WorkflowActions.startWorkflow = jest
      .fn()
      .mockReturnValue(() => Promise.resolve({ state: 'RUNNING' }));
    NodesActions.pollNodeslistDuringProgress = jest
      .fn()
      .mockReturnValue(() => {});
  });

  it('dispatches startOperation', () =>
    store.dispatch(NodesActions.startNodesIntrospection(nodeIds)).then(() => {
      expect(WorkflowActions.startWorkflow).toHaveBeenCalledWith(
        MistralConstants.BAREMETAL_INTROSPECT,
        {
          node_uuids: nodeIds,
          max_retry_attempts: 1
        },
        expect.any(Function),
        15 * 60 * 1000
      );
      expect(NodesActions.pollNodeslistDuringProgress).toHaveBeenCalled();
      expect(store.getActions()).toEqual([
        NodesActions.startOperation(nodeIds)
      ]);
    }));
});

describe('nodesIntrospectionFinished', () => {
  beforeEach(() => {
    NodesActions.fetchNodes = jest.fn().mockReturnValue(() => {});
  });

  it('handles successful nodes introspection', () => {
    const store = mockStore({});
    const execution = {
      input: {
        node_uuids: ['598612eb-f21b-435e-a868-7bb74e576cc2']
      },
      output: {},
      state: 'SUCCESS'
    };

    store.dispatch(NodesActions.nodesIntrospectionFinished(execution));
    expect(NodesActions.fetchNodes).toHaveBeenCalled();
    const actions = store.getActions();
    expect(Object.keys(actions).map(key => actions[key].type)).toEqual([
      'FINISH_NODES_OPERATION',
      'NOTIFY'
    ]);
  });

  it('handles failed nodes introspection', () => {
    const store = mockStore({});
    const execution = {
      input: {
        node_uuids: ['598612eb-f21b-435e-a868-7bb74e576cc2']
      },
      output: { message: 'Some error occurred during introspection' },
      state: 'ERROR'
    };

    store.dispatch(NodesActions.nodesIntrospectionFinished(execution));
    expect(NodesActions.fetchNodes).toHaveBeenCalled();
    const actions = store.getActions();
    expect(Object.keys(actions).map(key => actions[key].type)).toEqual([
      'FINISH_NODES_OPERATION',
      'NOTIFY'
    ]);
  });
});

describe('startProvideNodes Action', () => {
  const store = mockStore({});
  const nodeIds = ['598612eb-f21b-435e-a868-7bb74e576cc2'];

  beforeEach(() => {
    WorkflowActions.startWorkflow = jest
      .fn()
      .mockReturnValue(() => Promise.resolve({ state: 'RUNNING' }));
    NodesActions.pollNodeslistDuringProgress = jest
      .fn()
      .mockReturnValue(() => {});
  });

  it('dispatches actions', () =>
    store.dispatch(NodesActions.startProvideNodes(nodeIds)).then(() => {
      expect(WorkflowActions.startWorkflow).toHaveBeenCalled();
      expect(NodesActions.pollNodeslistDuringProgress).toHaveBeenCalled();
      expect(store.getActions()).toEqual([
        NodesActions.startOperation(nodeIds)
      ]);
    }));
});

describe('provideNodesFinished', () => {
  beforeEach(() => {
    NodesActions.fetchNodes = jest.fn().mockReturnValue(() => {});
  });

  it('handles success', () => {
    const store = mockStore({});
    const execution = {
      input: {
        node_uuids: ['598612eb-f21b-435e-a868-7bb74e576cc2']
      },
      output: {},
      state: 'SUCCESS'
    };

    store.dispatch(NodesActions.nodesIntrospectionFinished(execution));
    expect(NodesActions.fetchNodes).toHaveBeenCalled();
    const actions = store.getActions();
    expect(Object.keys(actions).map(key => actions[key].type)).toEqual([
      'FINISH_NODES_OPERATION',
      'NOTIFY'
    ]);
  });

  it('handles failure', () => {
    const store = mockStore({});
    const execution = {
      input: {
        node_uuids: ['598612eb-f21b-435e-a868-7bb74e576cc2']
      },
      output: {},
      state: 'ERROR'
    };

    store.dispatch(NodesActions.nodesIntrospectionFinished(execution));
    expect(NodesActions.fetchNodes).toHaveBeenCalled();
    const actions = store.getActions();
    expect(Object.keys(actions).map(key => actions[key].type)).toEqual([
      'FINISH_NODES_OPERATION',
      'NOTIFY'
    ]);
  });
});

describe('Update Node thunk action', () => {
  const store = mockStore({});
  const nodePatch = {
    uuid: 'someId',
    patches: [
      {
        op: 'replace',
        path: '/properties/capabilities',
        value: 'updated value for path'
      }
    ]
  };

  beforeEach(() => {
    IronicApiService.patchNode = jest
      .fn()
      .mockReturnValue(() => Promise.resolve({ uuid: 'someId' }));
  });

  it('dispatches required actions', () =>
    store.dispatch(NodesActions.updateNode(nodePatch)).then(() => {
      expect(store.getActions()).toEqual([
        NodesActions.updateNodePending('someId'),
        NodesActions.updateNodeSuccess({ uuid: 'someId' })
      ]);
    }));
});

describe('Delete Nodes thunk action', () => {
  const store = mockStore({});
  const nodeIds = ['598612eb-f21b-435e-a868-7bb74e576cc2'];

  beforeEach(() => {
    IronicApiService.deleteNode = jest
      .fn()
      .mockReturnValue(() => Promise.resolve());
  });

  it('successfully deletes a set of nodes', () =>
    store.dispatch(NodesActions.deleteNodes(nodeIds)).then(() => {
      expect(store.getActions()).toEqual([
        NodesActions.startOperation(nodeIds),
        NodesActions.deleteNodeSuccess(nodeIds[0])
      ]);
    }));
});
