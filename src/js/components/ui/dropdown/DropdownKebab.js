import { Dropdown } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';

const DropdownKebab = ({ children, id, pullRight, onSelect }) => {
  return (
    <Dropdown
      className="dropdown-kebab-pf"
      id={id}
      onSelect={onSelect}
      pullRight={pullRight}
    >
      <Dropdown.Toggle bsStyle="link" noCaret>
        <span className="fa fa-ellipsis-v" />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {children}
      </Dropdown.Menu>
    </Dropdown>
  );
};
DropdownKebab.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  onSelect: PropTypes.func,
  pullRight: PropTypes.bool
};
export default DropdownKebab;
