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

import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';
import { isObjectLike } from 'lodash';

import HorizontalInput from '../ui/reduxForm/HorizontalInput';
import HorizontalTextarea from '../ui/reduxForm/HorizontalTextarea';
import HorizontalCheckBox from '../ui/reduxForm/HorizontalCheckBox';
import HorizontalStaticText from '../ui/forms/HorizontalStaticText';

// TODO(jtomasek): rename this when original Formsy based ParameterInputList and
// ParameterInput are not used
class NewParameterInput extends React.Component {
  render() {
    const { name, label, description, defaultValue, value, type } = this.props;
    const commonProps = {
      component: HorizontalInput,
      name,
      id: name,
      label,
      description,
      labelColumns: 4,
      inputColumns: 8
    };
    if (value) {
      return (
        <HorizontalStaticText
          text={isObjectLike(value) ? JSON.stringify(value) : value}
          title={label}
          labelColumnClasses="col-sm-4"
          inputColumnClasses="col-sm-8"
        />
      );
    } else if (type.toLowerCase() === 'commadelimitedlist') {
      return (
        <Field
          {...commonProps}
          parse={value => value.split(',')}
          component={HorizontalTextarea}
        />
      );
    } else if (type.toLowerCase() === 'json' || isObjectLike(defaultValue)) {
      return <Field {...commonProps} component={HorizontalTextarea} />;
    } else if (
      type.toLowerCase() === 'string' &&
      /^.*(Key|Cert|Certificate)$/.test(name)
    ) {
      return <Field {...commonProps} component={HorizontalTextarea} />;
    } else if (type.toLowerCase() === 'number') {
      return (
        <Field
          {...commonProps}
          type="number"
          parse={value =>
            isNaN(parseInt(value)) ? undefined : parseInt(value)
          }
        />
      );
    } else if (type.toLowerCase() === 'boolean') {
      return (
        <Field
          {...commonProps}
          type="checkbox"
          component={HorizontalCheckBox}
        />
      );
    } else {
      return (
        <Field
          {...commonProps}
          component={HorizontalInput}
          description={description}
          labelColumns={4}
          inputColumns={8}
        />
      );
    }
  }
}
NewParameterInput.propTypes = {
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
NewParameterInput.defaultProps = {
  defaultValue: ''
};

export default NewParameterInput;
