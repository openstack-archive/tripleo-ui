import { InstancesState } from '../immutableRecords/instances';

const initialState = new InstancesState;

export default function currentPlanReducer(state = initialState, action) {
  switch(action.type) {

  // TODO(jtomasek): Add Instances fetching

  default:
    return state;

  }
}
