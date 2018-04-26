/**
 * Copyright 2018 Red Hat Inc.
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

import { sanitizeMessage } from '../../js/utils';

describe('sanitizeMessage', () => {
  it('handles strings', function() {
    const stringMessage = 'I am simple string message';
    expect(sanitizeMessage(stringMessage)).toEqual(stringMessage);
  });

  it('handles objects with message', function() {
    const message = { message: 'I am simple string message' };
    expect(sanitizeMessage(message)).toEqual('I am simple string message');
  });

  it('handles objects with result', function() {
    const message = { result: 'I am simple string message' };
    expect(sanitizeMessage(message)).toEqual('I am simple string message');
  });

  it('handles nested objects', function() {
    const message = { result: { message: 'I am simple string message' } };
    expect(sanitizeMessage(message)).toEqual('I am simple string message');
  });

  it('gives precedence to message against result key', function() {
    const message = { result: {}, message: 'I am simple string message' };
    expect(sanitizeMessage(message)).toEqual('I am simple string message');
  });

  it('returns an array of strings if message is array', function() {
    const message = { message: ['I am simple string message'] };
    expect(sanitizeMessage(message)).toEqual(['I am simple string message']);
  });
});
