import keyMirror from 'keymirror';

export default keyMirror({
  FETCH_ENVIRONMENT_SUCCESS: null,
  FETCH_ENVIRONMENT_PENDING: null,
  FETCH_ENVIRONMENT_FAILED: null,
  FETCH_RESOURCES_PENDING: null,
  FETCH_RESOURCES_SUCCESS: null,
  FETCH_RESOURCES_FAILED: null,
  FETCH_RESOURCE_SUCCESS: null,
  FETCH_RESOURCE_PENDING: null,
  FETCH_RESOURCE_FAILED: null,
  FETCH_STACKS_PENDING: null,
  FETCH_STACKS_SUCCESS: null,
  FETCH_STACKS_FAILED: null
});

export const deploymentStatusMessages = {
  CREATE_IN_PROGRESS: 'Deployment in progress.',
  CREATE_SUCCESS: 'Deployment succeeded.',
  CREATE_COMPLETE: 'Deployment succeeded.',
  CREATE_FAILED: 'The deployment failed.',
  DELETE_IN_PROGRESS: 'Deletion in progress.',
  UPDATE_IN_PROGRESS: 'Update in progress.',
  UPDATE_FAILED: 'The update failed.',
  UPDATE_SUCCESS: 'The update succeeded.'
};
