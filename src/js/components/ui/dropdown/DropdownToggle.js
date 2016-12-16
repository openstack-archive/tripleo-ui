import ClassNames from 'classnames';
import React from 'react';

export default class DropdownToggle extends React.Component {
  handleClick(e) {
    e.preventDefault();
    this.props.toggleDropdown();
  }

  render() {
    return (
      <a className={this.props.className}
         data-toggle="dropdown"
         onClick={this.handleClick.bind(this)}>
        {this.props.children}
      </a>
    );
  }
}
DropdownToggle.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  toggleDropdown: React.PropTypes.func
};

DropdownToggle.defaultProps = {
  className: "dropdown-toggle"
}
