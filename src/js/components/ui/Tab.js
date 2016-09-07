import React from 'react';

export default class Tab extends React.Component {
  render() {
    let className = this.props.isActive ? 'active' : '';
    return <li {...this.props} className={className}>{this.props.children}</li>;
  }
}
Tab.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ]),
  isActive: React.PropTypes.bool.isRequired
};
