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

import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import InlineNotification from '../ui/InlineNotification';
import ParameterInput from './NewParameterInput';

const messages = defineMessages({
  noParameters: {
    id: 'ParameterInputList.noParameters',
    defaultMessage:
      'There are currently no parameters to configure in this section.'
  }
});

// TODO(jtomasek): rename this when original Formsy based ParameterInputList and
// ParameterInput are not used
class NewParameterInputList extends React.Component {
  render() {
    const emptyParametersMessage =
      this.props.emptyParametersMessage ||
      this.props.intl.formatMessage(messages.noParameters);

    const parameters = this.props.parameters.map(parameter => {
      return (
        <ParameterInput
          key={parameter.name}
          name={parameter.name}
          label={parameter.label}
          description={parameter.description}
          defaultValue={parameter.default}
          value={parameter.value}
          type={parameter.type}
        />
      );
    });

    if (parameters.isEmpty()) {
      return (
        <fieldset>
          <InlineNotification type="info">
            {emptyParametersMessage}
          </InlineNotification>
        </fieldset>
      );
    } else {
      return <fieldset>{parameters}</fieldset>;
    }
  }
}
NewParameterInputList.propTypes = {
  emptyParametersMessage: PropTypes.string,
  intl: PropTypes.object,
  mistralParameters: ImmutablePropTypes.map,
  parameters: ImmutablePropTypes.list.isRequired
};

export default injectIntl(NewParameterInputList);
