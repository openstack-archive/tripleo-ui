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

import { defineMessages, injectIntl } from 'react-intl'
import ImmutablePropTypes from 'react-immutable-proptypes'
import PropTypes from 'prop-types'
import React from 'react'

import GenericCheckBox from '../ui/forms/GenericCheckBox'
import GroupedCheckBox from '../ui/forms/GroupedCheckBox'

const messages = defineMessages({
  requiredEnvironments: {
    id: 'EnvironmentGroup.requiredEnvironments',
    defaultMessage: 'This option requires {requiredEnvironments} to be enabled.'
  }
})

class EnvironmentGroup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      checkedEnvironment: null
    }
  }

  componentWillMount() {
    const firstCheckedEnvironment = this.props.environments
      .filter(env => env.get('enabled') === true)
      .first()
    this.setState({
      checkedEnvironment: firstCheckedEnvironment
        ? firstCheckedEnvironment.get('file')
        : null
    })
  }

  onGroupedCheckBoxChange(checked, environmentFile) {
    this.setState({ checkedEnvironment: checked ? environmentFile : null })
  }

  getRequiredEnvironmentsNames(environment) {
    return environment.requires
      .map(env => this.props.allEnvironments.getIn([env, 'title'], env))
      .toArray()
  }

  generateInputs() {
    const {
      environments,
      intl: { formatMessage },
      mutuallyExclusive
    } = this.props

    return environments.toList().map((environment, index) => {
      const requiredEnvironments = environment.requires.toArray()
      const requiredEnvironmentNames = this.getRequiredEnvironmentsNames(
        environment
      )
      if (mutuallyExclusive) {
        let checkBoxValue = this.state.checkedEnvironment === environment.file
        return (
          <GroupedCheckBox
            key={environment.file}
            name={environment.file}
            id={environment.file}
            title={environment.title}
            value={checkBoxValue}
            validations={{ requiredEnvironments: requiredEnvironments }}
            validationError={formatMessage(messages.requiredEnvironments, {
              requiredEnvironments: requiredEnvironmentNames
            })}
            onChange={this.onGroupedCheckBoxChange.bind(this)}
            description={environment.description}
          />
        )
      } else {
        return (
          <GenericCheckBox
            key={environment.file}
            name={environment.file}
            id={environment.file}
            title={environment.title}
            value={environment.get('enabled', false)}
            validations={{ requiredEnvironments: requiredEnvironments }}
            validationError={formatMessage(messages.requiredEnvironments, {
              requiredEnvironments: requiredEnvironmentNames
            })}
            description={environment.description}
          />
        )
      }
    })
  }

  render() {
    let environments = this.generateInputs()

    return (
      <div className="environment-group">
        <EnvironmentGroupHeading
          title={this.props.title}
          description={this.props.description}
        />
        {environments}
      </div>
    )
  }
}
EnvironmentGroup.propTypes = {
  allEnvironments: ImmutablePropTypes.map.isRequired,
  description: PropTypes.string,
  environments: ImmutablePropTypes.map,
  intl: PropTypes.object,
  mutuallyExclusive: PropTypes.bool.isRequired,
  title: PropTypes.string
}
EnvironmentGroup.defaultProps = {
  mutuallyExclusive: false
}

export default injectIntl(EnvironmentGroup)

class EnvironmentGroupHeading extends React.Component {
  render() {
    if (this.props.title) {
      return (
        <h4>
          {this.props.title}<br />
          <small>{this.props.description}</small>
        </h4>
      )
    } else if (this.props.description) {
      return <p>{this.props.description}</p>
    } else {
      return false
    }
  }
}
EnvironmentGroupHeading.propTypes = {
  description: PropTypes.string,
  title: PropTypes.string
}
