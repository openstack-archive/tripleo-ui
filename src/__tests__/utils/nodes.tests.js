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

import {
  parseNodeCapabilities,
  stringifyNodeCapabilities,
  setNodeCapability
} from '../../js/utils/nodes';

describe('parseNodeCapabilities', () => {
  beforeEach(function() {
    this.capabilitiesString = 'capability1:cap1,capability2:cap2';
  });

  it('returns an object from capabilities string', function() {
    const expectedObject = {
      capability1: 'cap1',
      capability2: 'cap2'
    };
    expect(parseNodeCapabilities(this.capabilitiesString)).toEqual(
      expectedObject
    );
  });
});

describe('stringifyNodeCapabilities', () => {
  beforeEach(function() {
    this.capabilitiesObject = {
      capability1: 'cap1',
      capability2: 'cap2'
    };
  });

  it('returns an string from capabilities object', function() {
    const expectedString = 'capability1:cap1,capability2:cap2';
    expect(stringifyNodeCapabilities(this.capabilitiesObject)).toEqual(
      expectedString
    );
  });

  it('removes capabilities with empty value', function() {
    const capabilitiesObject = {
      capability1: 'cap1',
      capability2: 'cap2',
      capability3: ''
    };
    const expectedString = 'capability1:cap1,capability2:cap2';
    expect(stringifyNodeCapabilities(capabilitiesObject)).toEqual(
      expectedString
    );
  });
});

describe('setNodeCapability', () => {
  it('updates node capabilities with new capability', function() {
    const inputString = 'capability1:cap1,capability2:cap2';
    const expectedString = 'capability1:cap1,capability2:cap2,capability3:cap3';
    expect(setNodeCapability(inputString, 'capability3', 'cap3')).toEqual(
      expectedString
    );
  });

  it('updates existing node capability', function() {
    const inputString = 'capability1:cap1,capability2:cap2';
    const expectedString = 'capability1:cap1,capability2:newValue';
    expect(setNodeCapability(inputString, 'capability2', 'newValue')).toEqual(
      expectedString
    );
  });
});
