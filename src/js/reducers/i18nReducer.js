import { fromJS, List, Map } from 'immutable';

const initialState = new Map({
  language: 'en'
});

export default function plansReducer(state = initialState, action) {
  switch(action.type) {

  case 'DETECT_LANGUAGE':
    return state.set('language', action.payload);

  case 'CHOOSE_LANGUAGE':
    return state.set('language', action.payload);

  default:
    return state;

  }
}
