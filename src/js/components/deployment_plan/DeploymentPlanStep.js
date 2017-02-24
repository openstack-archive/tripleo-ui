import React from 'react';

export const DeploymentPlanStep = ({ children, disabled, title, tooltip }) => {
  return (
    <li className={disabled ? 'disabled' : null}>
      <h3>
        <span>{title}</span>
        {tooltip ?
          <span is data-tooltip={tooltip} class="tooltip-right">
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
  children: React.PropTypes.node,
  disabled: React.PropTypes.bool,
  title: React.PropTypes.string.isRequired,
  tooltip: React.PropTypes.string
};

DeploymentPlanStep.defaultProps = {
  disabled: false
};
