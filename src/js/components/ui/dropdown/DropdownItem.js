import ClassNames from 'classnames';
import { Link } from 'react-router';
import React, { PropTypes } from 'react';

export default class DropdownItem extends React.Component {
  handleClick(e) {
    e.preventDefault();
    this.props.onClick(e);
    this.props.toggleDropdown(e);
  }

  render() {
    if (this.props.divider) {
      return <li className="divider" />;
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
  active: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  divider: PropTypes.bool,
  onClick: PropTypes.func,
  to: PropTypes.string,
  toggleDropdown: PropTypes.func
};
DropdownItem.defaultProps = {
  active: false,
  disabled: false,
  divider: false
};
