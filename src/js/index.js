/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import 'babel-polyfill';

import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';

import App from './components/App';
import history from './utils/history';
import I18nProvider from './components/i18n/I18nProvider';
import initFormsy from './components/utils/Formsy';
import { setupReduxFormValidators } from './utils/reduxFormValidators';
import store from './store';
import '../less/base.less';

initFormsy();

setupReduxFormValidators();

ReactDOM.render(
  <Provider store={store}>
    <I18nProvider>
      <Router history={history}>
        <App />
      </Router>
    </I18nProvider>
  </Provider>,
  document.getElementById('react-app-index')
);
