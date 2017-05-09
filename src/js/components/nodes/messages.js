import { defineMessages } from 'react-intl';
/**
 *  Maps Node property names to translated labels. This is used to populate toolbar select options
 *  or Table Column labels etc.
 */
export const nodeColumnMessages = defineMessages({
  'name': {
    id: 'NodeColumns.name',
    defaultMessage: 'Name'
  },
  'power_state': {
    id: 'NodeColumns.powerState',
    defaultMessage: 'Power State'
  },
  'provision_state': {
    id: 'NodeColumns.provisionState',
    defaultMessage: 'Provision State'
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
  'macs': {
    id: 'NodeColumns.macs',
    defaultMessage: 'Mac Addresses'
  }
});
