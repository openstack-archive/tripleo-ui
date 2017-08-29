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

import { defineMessages, FormattedMessage, injectIntl } from 'react-intl'
import { Field, reduxForm } from 'redux-form'
import { FormGroup, MenuItem } from 'react-bootstrap'
import PropTypes from 'prop-types'
import React from 'react'

import DropdownSelect from '../../ui/reduxForm/DropdownSelect'
import { nodeColumnMessages } from '../messages'
import { SortDirectionInput } from '../../ui/Toolbar/ToolbarInputs'

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
})

const NodesToolbarForm = ({ handleSubmit, intl }) => (
  <form onSubmit={handleSubmit}>
    <FormGroup>
      <Field
        name="sortBy"
        component={DropdownSelect}
        format={value => intl.formatMessage(nodeColumnMessages[value])}
      >
        <MenuItem eventKey="name">
          <FormattedMessage {...nodeColumnMessages.name} />
        </MenuItem>
        <MenuItem eventKey="properties.cpu_arch">
          <FormattedMessage {...nodeColumnMessages['properties.cpu_arch']} />
        </MenuItem>
        <MenuItem eventKey="properties.cpus">
          <FormattedMessage {...nodeColumnMessages['properties.cpus']} />
        </MenuItem>
        <MenuItem eventKey="properties.local_gb">
          <FormattedMessage {...nodeColumnMessages['properties.local_gb']} />
        </MenuItem>
        <MenuItem eventKey="properties.memory_mb">
          <FormattedMessage {...nodeColumnMessages['properties.memory_mb']} />
        </MenuItem>
        <MenuItem eventKey="power_state">
          <FormattedMessage {...nodeColumnMessages.power_state} />
        </MenuItem>
        <MenuItem eventKey="provision_state">
          <FormattedMessage {...nodeColumnMessages.provision_state} />
        </MenuItem>
      </Field>
      <Field
        name="sortDir"
        title={intl.formatMessage(messages.sortDir)}
        component={SortDirectionInput}
      />
    </FormGroup>
    {/*
    TODO(akrivoka): Hiding the view switcher for now, as the table view is buggy. Once the blueprint
    https://blueprints.launchpad.net/tripleo/+spec/ui-rework-nodestableview
    is implemented, we can show the view switcher again.
    */}
    {/*
    <FormGroup className="pull-right">
      <Field
        name="contentView"
        component={ContentViewSelectorInput}
        options={{
          list: intl.formatMessage(messages.list),
          table: intl.formatMessage(messages.table)
        }}
      />
    </FormGroup>
    */}
  </form>
)
NodesToolbarForm.propTypes = {
  children: PropTypes.node,
  handleSubmit: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired
}
export default injectIntl(
  reduxForm({
    form: 'nodesToolbar'
  })(NodesToolbarForm)
)
