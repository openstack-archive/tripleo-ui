import keyMirror from 'keymirror';

export default keyMirror({
  DELETE_STACK_PENDING: null,
  DELETE_STACK_FAILED: null,
  DELETE_STACK_SUCCESS: null,
  FETCH_ENVIRONMENT_SUCCESS: null,
  FETCH_ENVIRONMENT_PENDING: null,
  FETCH_ENVIRONMENT_FAILED: null,
  FETCH_RESOURCE_SUCCESS: null,
  FETCH_RESOURCE_PENDING: null,
  FETCH_RESOURCE_FAILED: null,
  FETCH_RESOURCES_PENDING: null,
  FETCH_RESOURCES_SUCCESS: null,
  FETCH_RESOURCES_FAILED: null,
  FETCH_STACKS_PENDING: null,
  FETCH_STACKS_SUCCESS: null,
  FETCH_STACKS_FAILED: null
});

export const stackStates = keyMirror({
  CREATE_IN_PROGRESS: null,
  CREATE_COMPLETE: null,
  CREATE_FAILED: null,
  DELETE_COMPLETE: null,
  DELETE_IN_PROGRESS: null,
  DELETE_FAILED: null,
  UPDATE_IN_PROGRESS: null,
  UPDATE_FAILED: null,
  UPDATE_COMPLETE: null
});

export const deploymentStatusMessages = {
  CREATE_IN_PROGRESS: 'Deployment in progress',
  CREATE_COMPLETE: 'Deployment succeeded',
  CREATE_FAILED: 'Deployment failed',
  DELETE_IN_PROGRESS: 'Deletion in progress',
  DELETE_FAILED: 'Deployment deletion failed',
  UPDATE_IN_PROGRESS: 'Update in progress',
  UPDATE_FAILED: 'Update failed',
  UPDATE_COMPLETE: 'Update succeeded'
};
