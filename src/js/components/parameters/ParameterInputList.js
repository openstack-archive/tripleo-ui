import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import InlineNotification from '../ui/InlineNotification';
import ParameterInput from './ParameterInput';

export default class ParameterInputList extends React.Component {
  render() {
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
            {this.props.emptyParametersMessage}
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
  emptyParametersMessage: React.PropTypes.string.isRequired,
  mistralParameters: ImmutablePropTypes.map.isRequired,
  parameters: ImmutablePropTypes.map.isRequired
};
ParameterInputList.defaultProps = {
  emptyParametersMessage: 'There are currently no parameters to configure in this section'
};
