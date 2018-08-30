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

export const MAC_ADDRESS_REGEX = new RegExp(
  /^([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}(,([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2})*$/
);

export const NODE_NAME_REGEX = new RegExp(/^[A-Z0-9-._~]+$/i);

export const IPV4_REGEX = new RegExp(
  /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
);

// Based on regex from Regular Expressions Cookbook, with added case insensitivity
// and end-line assertion.
export const FQDN_REGEX = new RegExp(
  /^\b((?=[a-z0-9-]{1,63}\.)[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}\b$/i
);

export const PORT_REGEX = new RegExp(
  /^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$/
);
