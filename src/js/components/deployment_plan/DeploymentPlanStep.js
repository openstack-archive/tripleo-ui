import React, { PropTypes } from 'react';

export const DeploymentPlanStep = ({ children, disabled, title, tooltip }) => {
  return (
    <li className={disabled ? 'disabled' : null}>
      <h3>
        <span>{title}</span>
        {tooltip ?
          <span data-tooltip={tooltip} className="tooltip-right">
            <span className="pficon pficon-info"/>
          </span>
          : null
        }
      </h3>
      {children}
    </li>
  );
};

DeploymentPlanStep.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
  title: PropTypes.string.isRequired,
  tooltip: PropTypes.string
};

DeploymentPlanStep.defaultProps = {
  disabled: false
};
