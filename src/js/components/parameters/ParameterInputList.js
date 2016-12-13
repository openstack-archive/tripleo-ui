import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

import InlineNotification from '../ui/InlineNotification';
import ParameterInput from './ParameterInput';

export default class ParameterInputList extends React.Component {
  render() {
    const parameters = this.props.parameters.map(parameter => {
      return (
        <ParameterInput key={parameter.name}
                        name={parameter.name}
                        label={parameter.label}
                        description={parameter.description}
                        defaultValue={parameter.default}
                        value={parameter.value}
                        type={parameter.type}/>
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
            {this.props.emptyParametersMessage}
          </InlineNotification>
        </fieldset>
      );
    }
  }
}
ParameterInputList.propTypes = {
  emptyParametersMessage: React.PropTypes.string.isRequired,
  mistralParameters: ImmutablePropTypes.map,
  parameters: React.PropTypes.array.isRequired
};
ParameterInputList.defaultProps = {
  emptyParametersMessage: 'There are currently no parameters to configure in this section'
};
