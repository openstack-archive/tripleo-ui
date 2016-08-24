import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import GenericCheckBox from '../ui/forms/GenericCheckBox';
import GroupedCheckBox from '../ui/forms/GroupedCheckBox';

export default class EnvironmentGroup extends React.Component {
  constructor(props) {
    super(props);
    let firstCheckedEnvironment = props.environments
                                    .filter(env => env.get('enabled') === true)
                                    .first();
    this.state = {
      checkedEnvironment: firstCheckedEnvironment ? firstCheckedEnvironment.file : null
    };
  }

  onGroupedCheckBoxChange(checked, environmentFile) {
    this.setState({ checkedEnvironment: checked ? environmentFile : null });
  }

  _generateInputs() {
    let environments = this.props.environments;
    if (environments.size > 1) {
      return environments.toArray().map((environment, index) => {
        let checkBoxValue = this.state.checkedEnvironment === environment.get('file')
          ? true
          : false;
        let requiresEnvironments = environment.get('requires')
          ? environment.get('requires').toArray()
          : undefined;
        return (
          <GroupedCheckBox key={index}
                           name={environment.get('file')}
                           id={environment.get('file')}
                           title={environment.get('title')}
                           value={checkBoxValue}
                           validations={{requiresEnvironments: requiresEnvironments}}
                           validationError={`This environment requires
                                             '${requiresEnvironments}'`}
                           checked={this.state.checkedEnvironment === environment.get('file')}
                           onChange={this.onGroupedCheckBoxChange.bind(this)}
                           description={environment.get('description')}/>
        );
      });
    } else if (environments.size === 1) {
      let environment = environments.first();
      let requiresEnvironments = environment.get('requires')
        ? environment.get('requires').toArray()
        : undefined;
      return (
        <GenericCheckBox name={environment.get('file')}
                         id={environment.get('file')}
                         title={environment.get('title')}
                         value={environment.get('enabled') || false}
                         validations={{requiresEnvironments: requiresEnvironments}}
                         validationError={`This environment requires
                                           '${requiresEnvironments}'`}
                         description={environment.get('description')}/>
      );
    }
  }

  render() {
    let environments = this._generateInputs();

    return (
      <div className="environment-group">
        <EnvironmentGroupHeading title={this.props.title}
                                 description={this.props.description}/>
        {environments}
      </div>
    );
  }
}
EnvironmentGroup.propTypes = {
  description: React.PropTypes.string,
  environments: ImmutablePropTypes.list,
  title: React.PropTypes.string
};


class EnvironmentGroupHeading extends React.Component {
  render() {
    if (this.props.title) {
      return (
        <h4>
          {this.props.title}<br/>
          <small>{this.props.description}</small>
        </h4>
      );
    } else if (this.props.description) {
      return (
        <p>{this.props.description}</p>
      );
    } else {
      return false;
    }
  }
}
EnvironmentGroupHeading.propTypes = {
  description: React.PropTypes.string,
  title: React.PropTypes.string
};
