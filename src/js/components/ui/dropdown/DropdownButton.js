import ClassNames from 'classnames';
import React from 'react';

export default class DropdownButton extends React.Component {
  handleClick(e) {
    e.preventDefault();
    this.props.toggleDropdown();
  }

  render() {
    return (
      <button className={ClassNames('btn dropdown-toggle', this.props.className)}
              onClick={this.handleClick.bind(this)}
              type="button">
        {this.props.children}
        <span className="caret"/>
      </button>
    );
  }
}
DropdownButton.propTypes = {
  children: React.PropTypes.node,
  className: React.PropTypes.string,
  toggleDropdown: React.PropTypes.func
};
