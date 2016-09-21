import keyMirror from 'keymirror';

export default keyMirror({
  FETCH_RESOURCES_PENDING: null,
  FETCH_RESOURCES_SUCCESS: null,
  FETCH_RESOURCES_FAILED: null,
  FETCH_STACKS_PENDING: null,
  FETCH_STACKS_SUCCESS: null,
  FETCH_STACKS_FAILED: null
});

export const deploymentStatusMessages = {
  CREATE_IN_PROGRESS: 'Deployment in progress',
  CREATE_SUCCESS: 'Deployment succeeded',
  CREATE_FAILED: 'Deployment failed',
  DELETE_IN_PROGRESS: 'Deletion in progress',
  DELETE_FAILED: 'Deployment deletion failed',
  UPDATE_IN_PROGRESS: 'Update in progress',
  UPDATE_FAILED: 'Update failed',
  UPDATE_SUCCESS: 'Update succeeded'
};
