import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import logger from './services/logger';

import appReducer from './reducers/appReducer';
import { getIntl } from './selectors/i18n';

const loggerMiddleware = createLogger({
  collapsed: true,
  logger: logger
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
