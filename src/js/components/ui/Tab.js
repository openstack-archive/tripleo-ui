import PropTypes from 'prop-types';
import React from 'react';

export default class Tab extends React.Component {
  render() {
    let className = this.props.isActive ? 'active' : '';
    return <li {...this.props} className={className}>{this.props.children}</li>;
  }
}
Tab.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  isActive: PropTypes.bool.isRequired
};
