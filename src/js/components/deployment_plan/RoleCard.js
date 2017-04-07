import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { Field } from 'redux-form';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import Link from '../ui/Link';
import NodePickerInput from '../ui/reduxForm/NodePickerInput';
import { maxValue,
         minValue,
         number,
         messages as validationMessages } from '../ui/reduxForm/validations';

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
    defaultMessage: 'of {count}',
    description: 'Used to display available nodes to assign, e.g. 1 of 2 Nodes Assigned'
  }
});

const RoleCard = ({ assignedNodesCountParameter,
                    availableNodesCount,
                    identifier,
                    intl,
                    name,
                    title }) => {
  const validations = [
    maxValue(availableNodesCount, intl.formatMessage(validationMessages.maxValue,
                                                     { max: availableNodesCount.toString() })),
    minValue(0, intl.formatMessage(validationMessages.minValue, { min: '0' })),
    number(intl.formatMessage(validationMessages.number))
  ];

  return (
    <div className={`card-pf card-pf-accented role-card ${identifier}`}>
      <h2 className="card-pf-title">
        {title}
        <Link to={`deployment-plan/roles/${identifier}`}
              className="link pull-right"
              title="Edit Role parameters">
          <span className="pficon pficon-edit"/>
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
                  max={availableNodesCount}/>
              : <NodePickerInput
                  increment={1}
                  input={{ value: '-' }}
                  meta={{ submitting: true }}
                  max={availableNodesCount}
                  min={0}/>}
          </div>
          <span className="card-pf-utilization-card-details-description">
            <span className="card-pf-utilization-card-details-line-1">
              <FormattedMessage
                {...messages.availableNodesCount}
                values={{ count: availableNodesCount.toString() }}/>
            </span>
            <span className="card-pf-utilization-card-details-line-2">
              <FormattedMessage {...messages.nodesAssigned}/>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
RoleCard.propTypes = {
  assignedNodesCountParameter: ImmutablePropTypes.record,
  availableNodesCount: React.PropTypes.number.isRequired,
  identifier: React.PropTypes.string.isRequired,
  intl: React.PropTypes.object,
  name: React.PropTypes.string.isRequired,
  title: React.PropTypes.string.isRequired
};

export default injectIntl(RoleCard);
