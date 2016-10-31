import keyMirror from 'keymirror';

export default keyMirror({
  FETCH_PARAMETERS_PENDING: null,
  FETCH_PARAMETERS_SUCCESS: null,
  FETCH_PARAMETERS_FAILED: null,
  UPDATE_PARAMETERS_PENDING: null,
  UPDATE_PARAMETERS_SUCCESS: null,
  UPDATE_PARAMETERS_FAILED: null
});

// List of parameter names which are considered internal and should not be displayed by GUI
// TODO(jtomasek): these should be ideally identified using ParameterGroup in THT
export const internalParameters = ['DefaultPasswords', 'ServiceNetMap', 'EndpointMap'];
