import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import { FormGroup, MenuItem } from 'react-bootstrap';
import React, { PropTypes } from 'react';

import DropdownSelect from '../../ui/reduxForm/DropdownSelect';
import { nodeColumnMessages } from '../messages';
import { ContentViewSelectorInput,
         SortDirectionInput } from '../../ui/Toolbar/ToolbarInputs';

const messages = defineMessages({
  table: {
    id: 'ContentView.table',
    defaultMessage: 'Table view'
  },
  list: {
    id: 'ContentView.list',
    defaultMessage: 'List view'
  },
  sortDir: {
    id: 'NodesToolbarForm.sortDir',
    defaultMessage: 'Sort direction'
  }
});

const NodesToolbarForm = ({ handleSubmit, intl }) => (
  <form onSubmit={handleSubmit}>
    <FormGroup>
      <Field
        name="sortBy"
        component={DropdownSelect}
        format={value => intl.formatMessage(nodeColumnMessages[value])}>
        <MenuItem eventKey="name">
          <FormattedMessage {...nodeColumnMessages.name}/>
        </MenuItem>
        <MenuItem eventKey="properties.cpu_arch">
          <FormattedMessage {...nodeColumnMessages['properties.cpu_arch']}/>
        </MenuItem>
        <MenuItem eventKey="properties.cpus">
          <FormattedMessage {...nodeColumnMessages['properties.cpus']}/>
        </MenuItem>
        <MenuItem eventKey="properties.local_gb">
          <FormattedMessage {...nodeColumnMessages['properties.local_gb']}/>
        </MenuItem>
        <MenuItem eventKey="properties.memory_mb">
          <FormattedMessage {...nodeColumnMessages['properties.memory_mb']}/>
        </MenuItem>
        <MenuItem eventKey="power_state">
          <FormattedMessage {...nodeColumnMessages.power_state}/>
        </MenuItem>
        <MenuItem eventKey="provision_state">
          <FormattedMessage {...nodeColumnMessages.provision_state}/>
        </MenuItem>
      </Field>
      <Field
        name="sortDir"
        title={intl.formatMessage(messages.sortDir)}
        component={SortDirectionInput}/>
    </FormGroup>
    <FormGroup className="pull-right">
      <Field
        name="contentView"
        component={ContentViewSelectorInput}
        options={{
          list: intl.formatMessage(messages.list),
          table: intl.formatMessage(messages.table)
        }} />
    </FormGroup>
  </form>
);
NodesToolbarForm.propTypes = {
  children: PropTypes.node,
  handleSubmit: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired
};
export default injectIntl(reduxForm({
  form: 'nodesToolbar'
})(NodesToolbarForm));
