import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import logger from './services/logger';

import appReducer from './reducers/appReducer';
import { getIntl } from './selectors/i18n';


const loggerMiddleware = createLogger({
  collapsed: true,
  logger: logger,
  // We're turning off all colors here because the formatting chars obscure the
  // content server-side.
  colors: {
    title: false,
    prevState: false,
    action: false,
    nextState: false,
    error: false
  }
});

const store = createStore(
  appReducer,
  {},
  applyMiddleware(
    thunkMiddleware.withExtraArgument({ getIntl }),
    loggerMiddleware
  )
);

export default store;
