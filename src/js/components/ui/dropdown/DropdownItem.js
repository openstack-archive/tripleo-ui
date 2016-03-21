import ClassNames from 'classnames';
import { Link } from 'react-router';
import React from 'react';

export default class DropdownItem extends React.Component {
  handleClick(e) {
    e.preventDefault();
    this.props.onClick(e);
    this.props.toggleDropdown(e);
  }

  render() {
    if (this.props.divider) {
      return (
        <li className="divider"></li>
      );
    }

    const classes = {
      disabled: this.props.disabled,
      active: this.props.active
    };

    if (this.props.to) {
      return (
        <li className={ClassNames(this.props.className, classes)}>
          <Link to={this.props.to} onClick={() => this.props.toggleDropdown()}>
            {this.props.children}
          </Link>
        </li>
      );
    }

    if (this.props.onClick) {
      return (
        <li className={ClassNames(this.props.className, classes)}>
          <a className="link" onClick={this.handleClick.bind(this)}>
            {this.props.children}
          </a>
        </li>
      );
    }

    return (
      <li className={ClassNames(this.props.className, classes)}>
        <a className="link">{this.props.children}</a>
      </li>
    );
  }
}
DropdownItem.propTypes = {
  active: React.PropTypes.bool,
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ]),
  className: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  divider: React.PropTypes.bool,
  onClick: React.PropTypes.func,
  to: React.PropTypes.string,
  toggleDropdown: React.PropTypes.func
};
DropdownItem.defaultProps = {
  active: false,
  disabled: false,
  divider: false
};
