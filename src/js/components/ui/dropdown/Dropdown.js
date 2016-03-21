import * as _ from 'lodash';
import ClassNames from 'classnames';
import React from 'react';

export default class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  toggleDropdown() {
    this.setState({ isOpen: !this.state.isOpen });
  }

  render() {
    const children = React.Children.toArray(this.props.children);

    const toggle = _.first(children, child => child.type.name === 'DropdownButton');

    const items = _.map(_.filter(children, child => child.type.name === 'DropdownItem'),
                        item => React.cloneElement(
                                  item,{ toggleDropdown: this.toggleDropdown.bind(this) }));

    // Any other children are prepended to DropdownButton.
    // This can be used to add buttons to Dropdown button group
    const otherChildren = _.reject(children, child => _.includes(['DropdownButton', 'DropdownItem'],
                                                          child.type.name));
    const dropdownClasses = {
      open: this.state.isOpen
    };

    return (
      <span>
        <div className={ClassNames('dropdown btn-group', dropdownClasses, this.props.className)}>
          {otherChildren}
          {React.cloneElement(toggle, { toggleDropdown: this.toggleDropdown.bind(this) })}
          <ul className="dropdown-menu" role="menu" ref='menu'>
            {items}
          </ul>
        </div>
        {this.state.isOpen ? <div onClick={this.toggleDropdown.bind(this)}
                                  className="modal-backdrop fade"></div> : null}
      </span>
    );
  }
}
Dropdown.propTypes = {
  active: React.PropTypes.bool,
  children: React.PropTypes.node,
  className: React.PropTypes.string
};
