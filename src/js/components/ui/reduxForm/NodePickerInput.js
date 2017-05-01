import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const NodePickerInput = props => {
  const {
    increment,
    input: { value, onChange },
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
      <NodeCount error={error}>
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
  min: PropTypes.number.isRequired
};
NodePickerInput.defaultProps = {
  min: 0
};
export default NodePickerInput;

const PickerArrow = ({ direction, disabled, onClick }) => {
  return (
    <button
      type="button"
      className={`btn btn-default btn-node-picker btn-node-picker-${direction}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={`fa fa-angle-${direction}`} aria-hidden="true" />
    </button>
  );
};
PickerArrow.propTypes = {
  direction: PropTypes.oneOf(['up', 'down']).isRequired,
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

const NodeCount = ({ children, error }) => {
  const classes = ClassNames({
    'node-count': true,
    'text-danger': error
  });
  return (
    <div className={classes} title={error}>
      {children}
    </div>
  );
};
NodeCount.propTypes = {
  children: PropTypes.node.isRequired,
  error: PropTypes.string
};
