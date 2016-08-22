import React from 'react';
import { Link } from 'react-router';

export const HardwareStep = () => {
  return (
    <Link className="btn btn-default" to="/nodes/registered/register">
      <span className="fa fa-plus"/> Register Nodes
    </Link>
  );
};
