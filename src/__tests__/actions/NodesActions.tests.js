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
      type: NodesConstants.START_NODES_OPERATION
    };
    expect(NodesActions.startOperation(mockGetNodesResponse)).toEqual(expectedAction);
  });

  it('creates action to notify that nodes operation finished', () => {
    const expectedAction = {
      type: NodesConstants.FINISH_NODES_OPERATION
    };
    expect(NodesActions.finishOperation(mockGetNodesResponse)).toEqual(expectedAction);
  });

  it('creates action to notify that nodes operation started', () => {
    const expectedAction = {
      type: NodesConstants.START_NODES_OPERATION
    };
    expect(NodesActions.startOperation(mockGetNodesResponse)).toEqual(expectedAction);
  });

  it('creates action to notify that nodes operation finished', () => {
    const expectedAction = {
      type: NodesConstants.FINISH_NODES_OPERATION
    };
    expect(NodesActions.finishOperation(mockGetNodesResponse)).toEqual(expectedAction);
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
