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

/**
 * Convert Node's capabilities string to object
 */
export const parseNodeCapabilities = (capabilities) => {
  let capsObject = {};
  capabilities.split(',').forEach(cap => {
    let tup = cap.split(/:(.*)/);
    capsObject[tup[0]] = tup[1];
  });
  return capsObject;
};

/**
 * Convert Node's capabilities object to string
 */
export const stringifyNodeCapabilities = (capabilities) => {
  return Object.keys(capabilities).reduce((caps, key) => {
    if (!capabilities[key]) {
      return caps;
    } else {
      caps.push(`${key}:${capabilities[key]}`);
      return caps;
    }
  }, []).join(',');
};

/**
 * Set or update Node capability
 */
export const setNodeCapability = (capabilitiesString, key, newValue) => {
  let capabilitiesObj = parseNodeCapabilities(capabilitiesString);
  capabilitiesObj[key] = newValue;
  return stringifyNodeCapabilities(capabilitiesObj);
};
