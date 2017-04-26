import { defineMessages, FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import React from 'react';

const messages = defineMessages({
  registerNodes: {
    id: 'HardwareStep.registerNodes',
    defaultMessage: 'Register Nodes'
  }
});

const HardwareStep = () => {
  return (
    <Link className="btn btn-default" to="/nodes/register">
      <span className="fa fa-plus"/> <FormattedMessage {...messages.registerNodes}/>
    </Link>
  );
};

export default HardwareStep;
