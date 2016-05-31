import when from 'when';

import IronicApiService from '../../js/services/IronicApiService';
import NodesActions from '../../js/actions/NodesActions';
import NodesConstants from '../../js/constants/NodesConstants';
import * as utils from '../../js/services/utils';

const mockGetNodesResponse = [
  { uuid: 1 },
  { uuid: 2 }
];

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
    expect(NodesActions.receiveNodes(mockGetNodesResponse)).toEqual(expectedAction);
  });

  it('creates action to notify that nodes operation started', () => {
    const expectedAction = {
      type: NodesConstants.START_NODES_OPERATION,
      payload: mockGetNodesResponse
    };
    expect(NodesActions.startOperation(mockGetNodesResponse)).toEqual(expectedAction);
  });

  it('creates action to notify that nodes operation finished', () => {
    const expectedAction = {
      type: NodesConstants.FINISH_NODES_OPERATION,
      payload: mockGetNodesResponse
    };
    expect(NodesActions.finishOperation(mockGetNodesResponse)).toEqual(expectedAction);
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
    expect(NodesActions.updateNodeSuccess(updatedNode))
      .toEqual(expectedAction);
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

// Use this to mock asynchronous functions which return a promise.
// The promise will immediately resolve with `data`.
let createResolvingPromise = (data) => {
  return () => {
    return when.resolve(data);
  };
};

describe('Asynchronous Nodes Actions', () => {
  beforeEach(done => {
    spyOn(utils, 'getAuthTokenId').and.returnValue('mock-auth-token');
    spyOn(utils, 'getServiceUrl').and.returnValue('mock-url');
    spyOn(NodesActions, 'requestNodes');
    spyOn(NodesActions, 'receiveNodes');
    // Mock the service call.
    spyOn(IronicApiService, 'getNodes').and.callFake(
      createResolvingPromise({ nodes: [{ uuid: 0 }] })
    );
    // Note that `getNode` is called multilpe times but always returns the same response
    // to keep the test simple.
    spyOn(IronicApiService, 'getNode').and.callFake(createResolvingPromise({ uuid: 0 }));
    // Call the action creator and the resulting action.
    // In this case, dispatch and getState are just empty placeHolders.
    NodesActions.fetchNodes()(() => {}, () => {});
    // Call `done` with a minimal timeout.
    setTimeout(() => { done(); }, 1);
  });

  it('dispatches requestNodes', () => {
    expect(NodesActions.requestNodes).toHaveBeenCalled();
  });

  it('dispatches receiveNodes', () => {
    expect(NodesActions.receiveNodes).toHaveBeenCalledWith({ 0:{ uuid: 0 }});
  });
});

describe('Update Node thunk action', () => {
  beforeEach(done => {
    spyOn(utils, 'getAuthTokenId').and.returnValue('mock-auth-token');
    spyOn(utils, 'getServiceUrl').and.returnValue('mock-url');
    spyOn(NodesActions, 'updateNodePending');
    spyOn(NodesActions, 'updateNodeSuccess');
    // Mock the service call.
    spyOn(IronicApiService, 'patchNode').and.callFake(
      createResolvingPromise({ uuid: 'someId' })
    );

    const nodePatch = {
      uuid: 'someId',
      patches: [{
        op: 'replace',
        path: '/properties/capabilities',
        value: 'updated value for path'
      }]
    };

    NodesActions.updateNode(nodePatch)(() => {}, () => {});
    // Call `done` with a minimal timeout.
    setTimeout(() => { done(); }, 1);
  });

  it('dispatches updateNodePending action', () => {
    expect(NodesActions.updateNodePending).toHaveBeenCalledWith('someId');
  });

  it('dispatches updateNodeSuccess action', () => {
    expect(NodesActions.updateNodeSuccess).toHaveBeenCalledWith({ uuid: 'someId' });
  });
});
