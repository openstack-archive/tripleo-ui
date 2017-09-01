import PropTypes from 'prop-types';
import React from 'react';

const Fieldset = ({ children, legend, ...other }) => (
  <fieldset className="fields-section-pf" {...other}>
    {legend && <legend className="fields-section-header-pf">{legend}</legend>}
    {children}
  </fieldset>
);
Fieldset.propTypes = {
  children: PropTypes.node,
  legend: PropTypes.node
};

export default Fieldset;
