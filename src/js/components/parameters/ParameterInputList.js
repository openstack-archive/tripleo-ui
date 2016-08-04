import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

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

    return (
      <fieldset>
        {parameters}
      </fieldset>
    );
  }
}
ParameterInputList.propTypes = {
  mistralParameters: ImmutablePropTypes.map.isRequired,
  parameters: ImmutablePropTypes.map.isRequired
};
