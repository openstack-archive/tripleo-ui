import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import { isObjectLike } from 'lodash';

import HorizontalInput from '../ui/forms/HorizontalInput';
import HorizontalNumberInput from '../ui/forms/HorizontalNumberInput';
import HorizontalTextarea from '../ui/forms/HorizontalTextarea';
import HorizontalCheckBox from '../ui/forms/HorizontalCheckBox';
import HorizontalStaticText from '../ui/forms/HorizontalStaticText';

const messages = defineMessages({
  enterValidJson: {
    id: 'ParameterInput.enterValidJson',
    defaultMessage: 'Please enter a valid JSON string.'
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
        <HorizontalNumberInput name={name}
                               title={label}
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
  defaultValue: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string
  ]),
  description: PropTypes.string.isRequired,
  intl: PropTypes.object,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.bool,
    PropTypes.number,
    PropTypes.string
  ])
};
ParameterInput.defaultProps = {
  defaultValue: ''
};

export default injectIntl(ParameterInput);
