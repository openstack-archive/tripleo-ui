import { AppConfig } from '../immutableRecords/appConfig';

const initialState = new AppConfig();

export default function appConfig(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
