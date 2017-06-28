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
  constructor(message, e) {
    super(message);
    this.config = e.config;
    this.request = e.request;
    this.response = e.response;
  }
}

class AuthenticationError extends BaseAxiosError {
  constructor(e) {
    super('Authentication failed, please log in', e);
  }
}

class ConnectionError extends BaseAxiosError {
  constructor(message, e) {
    super(message, e);
  }
}

class MistralApiError extends BaseAxiosError {
  constructor(e) {
    super(e.response.data.faultstring, e);
  }
}

class MistralExecutionError extends ExtendableError {
  constructor(response) {
    super(response.data.output);
    this.response = response;
  }
}

class SwiftApiError extends BaseAxiosError {}

export {
  BaseAxiosError,
  AuthenticationError,
  ConnectionError,
  MistralApiError,
  MistralExecutionError,
  SwiftApiError
};
