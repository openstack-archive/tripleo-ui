import matchers from 'jasmine-immutable-matchers';
import { Map } from 'immutable';

import NodesConstants from '../../js/constants/NodesConstants';
import nodesReducer from '../../js/reducers/nodesReducer';

describe('nodesReducer', () => {
  beforeEach(() => {
    jasmine.addMatchers(matchers);
  });

  const initialState = Map({
    isFetching: false,
    dataOperationInProgress: false,
    allFilter: '',
    registeredFilter: '',
    introspectedFilter: '',
    deployedFilter: '',
    maintenanceFilter: '',
    all: Map()
  });

  const updatedState = Map({
    isFetching: false,
    dataOperationInProgress: false,
    allFilter: '',
    registeredFilter: '',
    introspectedFilter: '',
    deployedFilter: '',
    maintenanceFilter: '',
    all: Map({
      uuid1: Map({
        uuid: 'uuid1'
      }),
      uuid2: Map({
        uuid: 'uuid2'
      })
    })
  });

  const updatedNodeState = Map({
    isFetching: false,
    dataOperationInProgress: false,
    allFilter: '',
    registeredFilter: '',
    introspectedFilter: '',
    deployedFilter: '',
    maintenanceFilter: '',
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
    })
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
    expect(newState.get('dataOperationInProgress')).toEqual(true);
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
    expect(newState.get('all')).toEqualImmutable(
      updatedNodeState.get('all')
    );
    expect(newState.get('dataOperationInProgress')).toEqual(false);
  });

  it('should handle UPDATE_NODE_FAILED', () => {
    const action = {
      type: NodesConstants.UPDATE_NODE_FAILED,
      payload: 'uuid1'
    };
    const newState = nodesReducer(updatedState, action);
    expect(newState).toEqualImmutable(updatedState);
    expect(newState.get('dataOperationInProgress')).toEqual(false);
  });
});
