import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router';
import React from 'react';

export const HardwareStep = () => {
  return (
    <Link className="btn btn-default" to="/nodes/registered/register">
      <span className="fa fa-plus"/> <FormattedMessage id="register-nodes"
                                                       defaultMessage="Register Nodes"
                                                       description="Register Nodes"/>
    </Link>
  );
};
