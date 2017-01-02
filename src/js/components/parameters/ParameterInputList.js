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
    const parameters = this.props.parameters.toList().map(parameter => {
      return (
        <ParameterInput key={parameter.Name}
                        name={parameter.Name}
                        label={parameter.Label}
                        description={parameter.Description}
                        defaultValue={parameter.Default}
                        value={parameter.Value}
                        type={parameter.Type}/>
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
      return (
        <fieldset>
          {parameters}
        </fieldset>
      );
    }
  }
}
ParameterInputList.propTypes = {
  emptyParametersMessage: React.PropTypes.string,
  intl: React.PropTypes.object,
  mistralParameters: ImmutablePropTypes.map.isRequired,
  parameters: ImmutablePropTypes.map.isRequired
};

export default injectIntl(ParameterInputList);
