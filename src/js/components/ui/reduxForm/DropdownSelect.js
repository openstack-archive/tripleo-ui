import { DropdownButton } from 'react-bootstrap';
import React from 'react';

const DropdownSelect = (props) => {
  const { children, input: { name, onChange, value } } = props;
  return (
    <DropdownButton id={name} title={value} onSelect={(evKey, ev) => onChange(evKey)}>
      {children}
    </DropdownButton>
  );
};
DropdownSelect.propTypes = {
  children: React.PropTypes.node,
  input: React.PropTypes.object.isRequired
};
export default DropdownSelect;
