import { defineMessages } from 'react-intl';
/**
 *  Maps Node property names to translated labels. This is used to populate toolbar select options
 *  or Table Column labels etc.
 */
export const nodeColumnMessages = defineMessages({
  name: {
    id: 'NodesToolbar.DropdownSelect.name',
    defaultMessage: 'Name'
  },
  power_state: {
    id: 'NodesToolbar.DropdownSelect.powerState',
    defaultMessage: 'Power State'
  },
  provision_state: {
    id: 'NodesToolbar.DropdownSelect.provisionState',
    defaultMessage: 'Provision State'
  }
});
