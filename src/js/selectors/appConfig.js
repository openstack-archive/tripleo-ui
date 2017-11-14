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

export const getAppConfig = state => state.appConfig;

export const getServiceUrlFromAppConfig = (state, service) =>
  state.appConfig.get(service);

export const getExcludedLanguages = state => state.appConfig.excludedLanguages;

export const getDefaultZaqarQueue = state =>
  state.appConfig.get('zaqar_default_queue', 'tripleo');

export const getLoggingZaqarQueue = state =>
  state.appConfig.get('logger-zaqar-queue', 'tripleo-ui-logging');

export const getAppVersion = state => state.appConfig.get('version');

export const getAppVersionGitSha = state => state.appConfig.get('gitSha');
