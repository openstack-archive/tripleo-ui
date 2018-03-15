/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const NodePickerInput = props => {
  const {
    increment,
    input: { name, value, onChange },
    max,
    meta: { error, submitting },
    min
  } = props;

  const incrementValue = increment => {
    const incrementedValue = value + increment;
    if (incrementedValue <= max && incrementedValue >= min) {
      return incrementedValue;
    } else if (incrementedValue > max) {
      return max;
    } else if (incrementedValue < min) {
      return min;
    }
  };

  return (
    <div className="node-picker">
      <PickerArrow
        direction="up"
        onClick={() => onChange(incrementValue(increment))}
        disabled={submitting || value + increment > max}
      />
      <NodeCount error={error} name={name}>
        <span className="value">{value}</span>
      </NodeCount>
      <PickerArrow
        direction="down"
        onClick={() => onChange(incrementValue(-increment))}
        disabled={submitting || value - increment < min}
      />
    </div>
  );
};
NodePickerInput.propTypes = {
  increment: PropTypes.number.isRequired,
  input: PropTypes.object.isRequired,
  max: PropTypes.number.isRequired,
  meta: PropTypes.object.isRequired,
  min: PropTypes.number.isRequired,
  name: PropTypes.string
};
NodePickerInput.defaultProps = {
  min: 0
};
export default NodePickerInput;

const PickerArrow = ({ direction, disabled, onClick }) => (
  <button
    type="button"
    className={`btn btn-default btn-node-picker btn-node-picker-${direction}`}
    onClick={onClick}
    disabled={disabled}
  >
    <span className={`fa fa-angle-${direction}`} aria-hidden="true" />
  </button>
);
PickerArrow.propTypes = {
  direction: PropTypes.oneOf(['up', 'down']).isRequired,
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

const NodeCount = ({ children, name, error }) => {
  const classes = ClassNames({
    'node-count': true,
    'text-danger': error
  });
  return error ? (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id={name}>{error}</Tooltip>}
    >
      <div className={classes}>{children}</div>
    </OverlayTrigger>
  ) : (
    <div className={classes}>{children}</div>
  );
};
NodeCount.propTypes = {
  children: PropTypes.node.isRequired,
  error: PropTypes.node,
  name: PropTypes.string
};
