import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { Field, reduxForm } from 'redux-form';
import { FormGroup, MenuItem } from 'react-bootstrap';
import React from 'react';
import { startCase } from 'lodash';

import DropdownSelect from '../ui/reduxForm/DropdownSelect';
import { nodeColumnMessages } from './messages';
import { SortDirectionInput,
         ContentViewSelectorInput } from '../ui/Toolbar/ToolbarInputs';

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
        format={value => startCase(value)}>
        <MenuItem eventKey="name">
          <FormattedMessage {...nodeColumnMessages.name}/>
        </MenuItem>
        <MenuItem eventKey="power_state">
          <FormattedMessage {...nodeColumnMessages.power_state}/>
        </MenuItem>
        <MenuItem eventKey="provision_state">
          <FormattedMessage {...nodeColumnMessages.power_state}/>
        </MenuItem>
      </Field>
      <Field
        name="sortDir"
        title={intl.formatMessage(messages.sortDir)}
        component={SortDirectionInput}/>
    </FormGroup>
    <FormGroup className="toolbar-pf-view-selector">
      <Field
        name="contentView"
        component={ContentViewSelectorInput}
        options={{
          table: intl.formatMessage(messages.table),
          list: intl.formatMessage(messages.list)
        }} />
    </FormGroup>
  </form>
);
NodesToolbarForm.propTypes = {
  children: React.PropTypes.node,
  handleSubmit: React.PropTypes.func.isRequired,
  intl: React.PropTypes.object.isRequired
};
export default injectIntl(reduxForm({
  form: 'nodesToolbar'
})(NodesToolbarForm));
