import * as _ from 'lodash';
import ClassNames from 'classnames';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import ResourceGroupList from './ResourceGroupList';

export default class ResourceGroupTab extends React.Component {
  constructor() {
    super();
    this.state = {
      expanded: false
    };
  }

  toggleExpanded(e) {
    e.preventDefault();
    this.setState({ expanded: !this.state.expanded });
  }

  activateTab(e) {
    e.preventDefault();
    this.props.activateTab(this.props.name);
  }

  isTabActive() {
    return this.props.activeTab === this.props.name;
  }

  renderIndentation(level) {
    return _.times(level, (n) => {
      return (<span key={n} className="indent"/>);
    });
  }

  render() {
    const { nestedGroups } = this.props;
    let expandSpanClasses = ClassNames({
      'icon': true,
      'expand-icon fa': nestedGroups,
      'fa-angle-down': this.state.expanded && nestedGroups,
      'fa-angle-right': !this.state.expanded && nestedGroups
    });

    let directorySpanClasses = ClassNames({
      'icon node-icon fa': true,
      'fa-folder': nestedGroups,
      'fa-file-o': !nestedGroups
    });

    return (
      <div>
        <li className={`list-group-item${this.isTabActive() ? ' node-selected' : ''}`}
            title={this.props.description}>
          {this.renderIndentation(this.props.level)}
          <span>
            <span onClick={this.toggleExpanded.bind(this)} className={expandSpanClasses}/>
            <span className={directorySpanClasses}/>
          </span>
          <span onClick={this.activateTab.bind(this)}>
            {this.props.name}
          </span>
        </li>
        {nestedGroups ? (
          <ResourceGroupList level={this.props.level+1}
                             nestedGroups={nestedGroups}
                             expanded={this.state.expanded}
                             activeTab={this.props.activeTab}
                             activateTab={this.props.activateTab}/>
        ) : null}
      </div>
    );
  }
}
ResourceGroupTab.propTypes = {
  activateTab: React.PropTypes.func,
  activeTab: React.PropTypes.string,
  description: React.PropTypes.string.isRequired,
  level: React.PropTypes.number.isRequired,
  name: React.PropTypes.string,
  nestedGroups: ImmutablePropTypes.map
};
ResourceGroupTab.defaultProps = {
  description: '',
  level: 0
};
