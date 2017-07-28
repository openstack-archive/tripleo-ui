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

import { isValidSubnet } from '../../js/utils/regex';

describe('Subnet validation', () => {
  it('approves correct values', () => {
    expect(isValidSubnet('0.0.0.0')).toBeTruthy();
    expect(isValidSubnet(' 0.0.0.0   ')).toBeTruthy();
    expect(isValidSubnet('192.168.0.1')).toBeTruthy();
    expect(isValidSubnet('10.0.0.0')).toBeTruthy();
    expect(isValidSubnet('10.0.0.0/0')).toBeTruthy();
    expect(isValidSubnet('10.0.0.0/8')).toBeTruthy();
    expect(isValidSubnet('10.0.0.0/24')).toBeTruthy();
  });

  it('rejects wrong values', () => {
    expect(isValidSubnet(null)).toBeFalsy();
    expect(isValidSubnet(undefined)).toBeFalsy();
    expect(isValidSubnet(0)).toBeFalsy();
    expect(isValidSubnet(1)).toBeFalsy();
    expect(isValidSubnet('1')).toBeFalsy();
    expect(isValidSubnet('Hello')).toBeFalsy();
    expect(isValidSubnet('999.999.999.999')).toBeFalsy();
    expect(isValidSubnet('0.0.0.0/')).toBeFalsy();
    expect(isValidSubnet('0.0.0.0/123')).toBeFalsy();
    expect(isValidSubnet('0.0.0.0/abc')).toBeFalsy();
  });
});
