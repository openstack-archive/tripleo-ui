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

import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import React from 'react';
import PropTypes from 'prop-types';
import { reduxForm, FieldArray } from 'redux-form';
import { Form } from 'react-bootstrap';
import ImmutablePropTypes from 'react-immutable-proptypes';

import BlankSlate from '../../ui/BlankSlate';
import InlineNotification from '../../ui/InlineNotification';
import RegisterNodeFields from './RegisterNodeFields';
import TabPane from '../../ui/TabPane';

const messages = defineMessages({
  addANodeManually: {
    id: 'RegisterNodesDialog.addANodeManually',
    defaultMessage: 'Add a node manually or upload nodes from a file.'
  },
  noNodesToRegister: {
    id: 'RegisterNodesDialog.noNodesToRegister',
    defaultMessage: '"No Nodes To Register"'
  }
});

export const RegisterNodesTabPanes = ({
  fields,
  meta,
  selectedNodeIndex,
  drivers
}) => {
  return (
    <div className="tab-content">
      {fields.map((node, index, fields) => {
        return (
          <TabPane
            key={index}
            isActive={selectedNodeIndex === index}
            // renderOnlyActive
          >
            <RegisterNodeFields node={node} drivers={drivers} />
          </TabPane>
        );
      })}
    </div>
  );
};
RegisterNodesTabPanes.propTypes = {
  drivers: ImmutablePropTypes.list.isRequired,
  fields: PropTypes.object.isRequired,
  meta: PropTypes.object.isRequired,
  selectedNodeIndex: PropTypes.number.isRequired
};

const RegisterNodesForm = ({
  error,
  handleSubmit,
  intl: { formatMessage },
  selectedNodeIndex,
  drivers
}) => (
  <Form onSubmit={handleSubmit} horizontal>
    {error && <InlineNotification>{error}</InlineNotification>}
    {selectedNodeIndex !== -1 ? (
      <FieldArray
        name="nodes"
        component={RegisterNodesTabPanes}
        selectedNodeIndex={selectedNodeIndex}
        drivers={drivers}
      />
    ) : (
      <BlankSlate
        iconClass="fa fa-cubes"
        title={formatMessage(messages.noNodesToRegister)}
      >
        <p>
          <FormattedMessage {...messages.addANodeManually} />
        </p>
      </BlankSlate>
    )}
  </Form>
);
RegisterNodesForm.propTypes = {
  drivers: ImmutablePropTypes.list.isRequired,
  error: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  selectedNodeIndex: PropTypes.number.isRequired
};

const form = reduxForm({
  form: 'registerNodesForm',
  initialValues: { nodes: [] },
  destroyOnUnmount: false
});

export default injectIntl(form(RegisterNodesForm));
