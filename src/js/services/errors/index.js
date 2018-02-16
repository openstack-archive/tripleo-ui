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

import ExtendableError from 'es6-error';

class BaseAxiosError extends ExtendableError {
  constructor(name, message, e) {
    super(message);
    this.name = name; // name is set explicitly otherwise it gets mangled in minification
    this.config = e.config;
    this.request = e.request;
    this.response = e.response;
  }
}

class AuthenticationError extends BaseAxiosError {
  constructor(e) {
    super(
      'AuthenticationError',
      'Authentication failed, please log in again',
      e
    );
  }
}

class ConnectionError extends BaseAxiosError {
  constructor(message, e) {
    super('ConnectionError', message, e);
  }
}

class MistralApiError extends BaseAxiosError {
  constructor(e) {
    super('MistralApiError', e.response.data.faultstring, e);
  }
}

class MistralExecutionError extends ExtendableError {
  constructor(response) {
    super(response.data.output);
    this.name = 'MistralExecutionError';
    this.response = response;
  }
}

class SwiftApiError extends BaseAxiosError {}

class IronicApiError extends BaseAxiosError {
  constructor(e) {
    const message = JSON.parse(e.response.data.error_message);
    super('IronicApiError', message.faultstring, e);
  }
}

class IronicInspectorApiError extends BaseAxiosError {
  constructor(e) {
    super('IronicInspectorApiError', e.response.data.error.message, e);
  }
}

class HeatApiError extends BaseAxiosError {
  constructor(e) {
    const { data } = e.response;
    super('HeatApiError', data.message || data.error.message, e);
  }
}

class KeystoneApiError extends BaseAxiosError {
  constructor(e) {
    super('KeystoneApiError', e.response.data.error.message, e);
  }
}

class NovaApiError extends BaseAxiosError {
  constructor(e) {
    super('NovaApiError', e.response.data.error.message, e);
  }
}

export {
  BaseAxiosError,
  AuthenticationError,
  ConnectionError,
  MistralApiError,
  MistralExecutionError,
  SwiftApiError,
  IronicApiError,
  IronicInspectorApiError,
  HeatApiError,
  KeystoneApiError,
  NovaApiError
};
