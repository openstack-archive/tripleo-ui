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
import { Field } from 'redux-form';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';

import Link from '../ui/Link';
import NodePickerInput from '../ui/reduxForm/NodePickerInput';
import {
  maxValue,
  minValue,
  number,
  messages as validationMessages
} from '../ui/reduxForm/validations';

const messages = defineMessages({
  nodesAssigned: {
    id: 'RoleCard.nodesAssigned',
    defaultMessage: 'Nodes assigned'
  },
  assignNodes: {
    id: 'RoleCard.assignNodes',
    defaultMessage: 'Assign Nodes'
  },
  availableNodesCount: {
    id: 'RoleCard.availableNodesCount',
    defaultMessage: 'of {count, number}',
    description: 'Used to display available nodes to assign, e.g. 1 of 2 Nodes Assigned'
  }
});

const RoleCard = ({
  assignedNodesCountParameter,
  availableNodesCount,
  currentPlanName,
  identifier,
  intl,
  name,
  title
}) => {
  const validations = [
    maxValue(
      availableNodesCount,
      intl.formatMessage(validationMessages.maxValue, {
        max: availableNodesCount
      })
    ),
    minValue(0, intl.formatMessage(validationMessages.minValue, { min: '0' })),
    number(intl.formatMessage(validationMessages.number))
  ];

  return (
    <div className={`card-pf card-pf-accented role-card ${identifier}`}>
      <h2 className="card-pf-title">
        {title}
        <Link
          to={`/plans/${currentPlanName}/roles/${identifier}`}
          className="link pull-right"
          title="Edit Role parameters"
        >
          <span className="pficon pficon-edit" />
        </Link>
      </h2>
      <div className="card-pf-body">
        <div className="card-pf-utilization-details">
          <div className="node-picker-cell">
            {assignedNodesCountParameter
              ? <Field
                  component={NodePickerInput}
                  increment={1}
                  validate={validations}
                  name={assignedNodesCountParameter.name}
                  max={availableNodesCount}
                />
              : <NodePickerInput
                  increment={1}
                  input={{ value: '-' }}
                  meta={{ submitting: true }}
                  max={availableNodesCount}
                  min={0}
                />}
          </div>
          <span className="card-pf-utilization-card-details-description">
            <span className="card-pf-utilization-card-details-line-1">
              <FormattedMessage
                {...messages.availableNodesCount}
                values={{ count: availableNodesCount }}
              />
            </span>
            <span className="card-pf-utilization-card-details-line-2">
              <FormattedMessage {...messages.nodesAssigned} />
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
RoleCard.propTypes = {
  assignedNodesCountParameter: ImmutablePropTypes.record,
  availableNodesCount: PropTypes.number.isRequired,
  currentPlanName: PropTypes.string.isRequired,
  identifier: PropTypes.string.isRequired,
  intl: PropTypes.object,
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired
};

export default injectIntl(RoleCard);
