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

import { trim } from 'lodash';

// e.g. "0.0.0.0" or "192.168.0.0/24"
export const subnetRegex = new RegExp(
  /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}/.source + // first 3 groups
  /([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])/.source + // last group
    /(\/([0-9]|[1-2][0-9]|3[0-2]))?$/.source // cidr
);

export const macAddressRegex = new RegExp(
  /^([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}/.source +
    /(,([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2})*$/.source
);

export function isValidSubnet(subnet) {
  return subnetRegex.test(trim(subnet));
}
