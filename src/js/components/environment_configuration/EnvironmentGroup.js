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

import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';
import { change, Field } from 'redux-form';

import EnvironmentGroupHeading from './EnvironmentGroupHeading';
import EnvironmentCheckBox from './EnvironmentCheckBox';

class EnvironmentGroup extends React.Component {
  /**
   * When enabling environment in mutually exclusive group disable other
   * environments in the group
   */
  handleEnablingEnvironment = (event, newValue, previousValue) => {
    const { changeValue, environments } = this.props;
    if (newValue) {
      environments
        .delete(event.target.name.replace(':', '.'))
        .map(env => changeValue(env.file.replace('.', ':'), false));
    }
  };

  render() {
    const { title, description, environments, mutuallyExclusive } = this.props;
    return (
      <div className="environment-group">
        <EnvironmentGroupHeading title={title} description={description} />
        {environments
          .toList()
          .map((environment, index) => (
            <Field
              labelColumns={0}
              inputColumns={12}
              id={environment.file}
              key={environment.file}
              label={environment.title}
              title={environment.file}
              description={environment.description}
              name={environment.file.replace('.', ':')}
              component={EnvironmentCheckBox}
              type="checkbox"
              onChange={
                mutuallyExclusive ? this.handleEnablingEnvironment : null
              }
            />
          ))}
      </div>
    );
  }
}
EnvironmentGroup.propTypes = {
  changeValue: PropTypes.func.isRequired,
  description: PropTypes.string,
  environments: ImmutablePropTypes.map,
  mutuallyExclusive: PropTypes.bool.isRequired,
  title: PropTypes.string
};
EnvironmentGroup.defaultProps = {
  mutuallyExclusive: false
};

const mapDispatchToProps = dispatch => ({
  changeValue: (field, value) =>
    dispatch(change('environmentConfigurationForm', field, value))
});

export default connect(null, mapDispatchToProps)(EnvironmentGroup);
