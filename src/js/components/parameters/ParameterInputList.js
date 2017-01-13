import { defineMessages, injectIntl } from 'react-intl';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import InlineNotification from '../ui/InlineNotification';
import ParameterInput from './ParameterInput';

const messages = defineMessages({
  noParameters: {
    id: 'ParameterInputList.noParameters',
    defaultMessage: 'There are currently no parameters to configure in this section'
  }
});

class ParameterInputList extends React.Component {
  render() {
    const emptyParametersMessage = this.props.emptyParametersMessage
                                   || this.props.intl.formatMessage(messages.noParameters);

    const parameters = this.props.parameters.map(parameter => {
      return (
        <ParameterInput key={parameter.name}
                        name={parameter.name}
                        label={parameter.label}
                        description={parameter.description}
                        defaultValue={parameter.default}
                        value={parameter.value}
                        type={parameter.type} />
      );
    });

    if (parameters.length > 0) {
      return (
        <fieldset>
          {parameters}
        </fieldset>
      );
    } else {
      return (
        <fieldset>
          <InlineNotification type="info">
            {emptyParametersMessage}
          </InlineNotification>
        </fieldset>
      );
    }
  }
}
ParameterInputList.propTypes = {
  emptyParametersMessage: React.PropTypes.string,
  intl: React.PropTypes.object,
  mistralParameters: ImmutablePropTypes.map,
  parameters: React.PropTypes.array.isRequired
};

export default injectIntl(ParameterInputList);
