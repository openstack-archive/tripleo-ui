import { Map } from 'immutable';

const initialState = new Map({
  language: 'en',
  messages: {}
});

export default function plansReducer(state = initialState, action) {
  switch(action.type) {

  case 'DETECT_LANGUAGE':
    return state
             .set('language', action.payload.language)
             .set('messages', action.payload.messages);

  case 'CHOOSE_LANGUAGE':
    return state.set('language', action.payload);

  default:
    return state;

  }
}
