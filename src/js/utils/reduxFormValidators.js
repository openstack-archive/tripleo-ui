import React from 'react';
import Validators from 'redux-form-validators';
import { FormattedMessage } from 'react-intl';

export const setupReduxFormValidators = () => {
  Validators.formatMessage = function(msg) {
    return <FormattedMessage {...msg.props || msg} />;
  };
};
