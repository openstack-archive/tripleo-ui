import { DropdownButton } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';

const DropdownSelect = props => {
  const { children, input: { name, onChange, value } } = props;
  return (
    <DropdownButton
      id={name}
      title={value}
      onSelect={(evKey, ev) => onChange(evKey)}
    >
      {children}
    </DropdownButton>
  );
};
DropdownSelect.propTypes = {
  children: PropTypes.node,
  input: PropTypes.object.isRequired
};
export default DropdownSelect;
