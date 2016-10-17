import React from 'react';
import { Map, List } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import HorizontalInput from '../ui/forms/HorizontalInput';
import HorizontalTextarea from '../ui/forms/HorizontalTextarea';
import HorizontalCheckBox from '../ui/forms/HorizontalCheckBox';
import HorizontalStaticText from '../ui/forms/HorizontalStaticText';

export default class ParameterInput extends React.Component {
  /**
  * Process the parameter, generate relevant input
  */
  render() {
    const { name, label, description, defaultValue, value, type } = this.props;
    if(value) {
      return (
        <HorizontalStaticText text={value}
                              title={label}
                              labelColumnClasses="col-sm-4"
                              inputColumnClasses="col-sm-8"/>
      );
    } else if (type.toLowerCase() === 'json' || Map.isMap(defaultValue)) {
      return (
        <HorizontalTextarea name={name}
                            title={label}
                            description={description}
                            value={defaultValue ? JSON.stringify(defaultValue.toJS()) : ''}
                            labelColumnClasses="col-sm-4"
                            inputColumnClasses="col-sm-8"/>
      );
    } else if (type.toLowerCase() === 'commadelimitedlist' && List.isList(defaultValue)) {
      return (
        <HorizontalTextarea name={name}
                            title={label}
                            description={description}
                            value={defaultValue.toJS()}
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
    ImmutablePropTypes.list,
    ImmutablePropTypes.map,
    React.PropTypes.bool,
    React.PropTypes.number,
    React.PropTypes.string
  ]).isRequired,
  description: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  value: React.PropTypes.string
};
ParameterInput.defaultProps = {
  defaultValue: ''
};
