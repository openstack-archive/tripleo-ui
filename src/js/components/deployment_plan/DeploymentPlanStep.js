import React from 'react';

export const DeploymentPlanStep = ({ children, disabled, title }) => {
  return (
    <li className={disabled ? 'disabled' : null}>
      <h3>
        <span>{title}</span>
      </h3>
      {children}
    </li>
  );
};

DeploymentPlanStep.propTypes = {
  children: React.PropTypes.node,
  disabled: React.PropTypes.bool,
  title: React.PropTypes.string.isRequired
};

DeploymentPlanStep.defaultProps = {
  disabled: false
};
