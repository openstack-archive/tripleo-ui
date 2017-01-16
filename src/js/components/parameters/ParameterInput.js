import { defineMessages, injectIntl } from 'react-intl';
import React from 'react';
import { isObjectLike } from 'lodash';

import HorizontalInput from '../ui/forms/HorizontalInput';
import HorizontalTextarea from '../ui/forms/HorizontalTextarea';
import HorizontalCheckBox from '../ui/forms/HorizontalCheckBox';
import HorizontalStaticText from '../ui/forms/HorizontalStaticText';

const messages = defineMessages({
  enterValidJson: {
    id: 'ParameterInput.enterValidJson',
    defaultMessage: 'Please enter a valid JSON string'
  }
});

class ParameterInput extends React.Component {
  /**
  * Process the parameter, generate relevant input
  */
  render() {
    const { name, label, description, defaultValue, value, type } = this.props;
    if(value) {
      return (
        <HorizontalStaticText text={isObjectLike(value) ? JSON.stringify(value) : value}
                              title={label}
                              labelColumnClasses="col-sm-4"
                              inputColumnClasses="col-sm-8"/>
      );
    } else if (type.toLowerCase() === 'json' || isObjectLike(defaultValue)) {
      return (
        <HorizontalTextarea name={name}
                            title={label}
                            description={description}
                            value={defaultValue ? JSON.stringify(defaultValue) : ''}
                            validations="isJson"
                            validationError={this.props.intl.formatMessage(messages.enterValidJson)}
                            labelColumnClasses="col-sm-4"
                            inputColumnClasses="col-sm-8"/>
      );
    } else if (type.toLowerCase() === 'commadelimitedlist') {
      return (
        <HorizontalTextarea name={name}
                            title={label}
                            description={description}
                            value={defaultValue}
                            labelColumnClasses="col-sm-4"
                            inputColumnClasses="col-sm-8"/>
      );
    } else if(type.toLowerCase() === 'string' &&
              /^.*(Key|Cert|Certificate)$/.test(name)) {
      return (
        <HorizontalTextarea name={name}
                            title={label}
                            description={description}
                            value={defaultValue}
                            labelColumnClasses="col-sm-4"
                            inputColumnClasses="col-sm-8"/>
      );
    } else if(type.toLowerCase() === 'number') {
      return (
        <HorizontalInput name={name}
                         title={label}
                         type="number"
                         min={0}
                         description={description}
                         value={defaultValue}
                         labelColumnClasses="col-sm-4"
                         inputColumnClasses="col-sm-8"/>
      );
    } else if(type.toLowerCase() === 'boolean') {
      return (
        <HorizontalCheckBox name={name}
                            id={name}
                            title={label}
                            description={description}
                            value={defaultValue}
                            labelColumnClasses="col-sm-4"
                            inputColumnClasses="col-sm-8"/>
      );
    } else {
      return (
        <HorizontalInput name={name}
                         title={label}
                         description={description}
                         value={defaultValue}
                         labelColumnClasses="col-sm-4"
                         inputColumnClasses="col-sm-8"/>
      );
    }
  }
}

ParameterInput.propTypes = {
  defaultValue: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.array,
    React.PropTypes.bool,
    React.PropTypes.number,
    React.PropTypes.string
  ]),
  description: React.PropTypes.string.isRequired,
  intl: React.PropTypes.object,
  label: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  value: React.PropTypes.oneOfType([
    React.PropTypes.object,
    React.PropTypes.array,
    React.PropTypes.bool,
    React.PropTypes.number,
    React.PropTypes.string
  ])
};
ParameterInput.defaultProps = {
  defaultValue: ''
};

export default injectIntl(ParameterInput);
