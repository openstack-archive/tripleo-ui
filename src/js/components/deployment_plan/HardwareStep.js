import { defineMessages, injectIntl } from 'react-intl';
import { Link } from 'react-router';
import React from 'react';

const messages = defineMessages({
  registerNodes: {
    id: 'HardwareStep.registerNodes',
    defaultMessage: 'Register Nodes'
  }
});

const HardwareStep = ({ intl }) => {
  return (
    <Link className="btn btn-default" to="/nodes/registered/register">
      <span className="fa fa-plus"/> {intl.formatMessage(messages.registerNodes)}
    </Link>
  );
};

HardwareStep.propTypes = {
  intl: React.PropTypes.object
};

export default injectIntl(HardwareStep);
