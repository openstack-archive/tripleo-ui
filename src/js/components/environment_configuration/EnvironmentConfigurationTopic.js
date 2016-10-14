import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import EnvironmentGroup from './EnvironmentGroup';

export default class EnvironmentConfigurationTopic extends React.Component {
  render() {
    let environmentGroups = this.props.environmentGroups.toList().map((envGroup, index) => {
      return (
        <EnvironmentGroup key={index}
                          title={envGroup.get('title')}
                          description={envGroup.get('description')}
                          environments={envGroup.get('environments')}/>
      );
    });


    return (
      <fieldset className="environment-topic">
        {environmentGroups}
      </fieldset>
    );
  }
}
EnvironmentConfigurationTopic.propTypes = {
  description: React.PropTypes.string,
  environmentGroups: ImmutablePropTypes.list,
  title: React.PropTypes.string.isRequired
};
