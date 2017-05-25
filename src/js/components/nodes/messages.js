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

import { defineMessages } from 'react-intl';
/**
 *  Maps Node property names to translated labels. This is used to populate toolbar select options
 *  or Table Column labels etc.
 */
export const nodeColumnMessages = defineMessages({
  name: {
    id: 'NodeColumns.name',
    defaultMessage: 'Name'
  },
  power_state: {
    id: 'NodeColumns.powerState',
    defaultMessage: 'Power State'
  },
  provision_state: {
    id: 'NodeColumns.provisionState',
    defaultMessage: 'Provision State'
  },
  'introspectionStatus.state': {
    id: 'NodeColumns.introspectionStatus',
    defaultMessage: 'Introspection Status'
  },
  'properties.cpu_arch': {
    id: 'NodeColumns.cpuArch',
    defaultMessage: 'CPU Arch.'
  },
  'properties.cpus': {
    id: 'NodeColumns.cpus',
    defaultMessage: 'CPU (cores)'
  },
  'properties.local_gb': {
    id: 'NodeColumns.localGB',
    defaultMessage: 'Disk (GB)'
  },
  'properties.memory_mb': {
    id: 'NodeColumns.memoryMb',
    defaultMessage: 'Memory (MB)'
  },
  'properties.capabilities.profile': {
    id: 'NodeColumns.profile',
    defaultMessage: 'Profile'
  },
  macs: {
    id: 'NodeColumns.macs',
    defaultMessage: 'Mac Addresses'
  }
});
