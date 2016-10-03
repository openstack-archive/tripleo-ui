import ClassNames from 'classnames';
import React from 'react';

const ProgressBar = ({ label, labelPosition, value }) => {
  const classes = ClassNames({
    'progress': true,
    'progress-label-top-right': labelPosition === 'topRight',
    'progress-label-left': labelPosition === 'left'
  });

  return(
    <div className={classes}>
      <div className="progress-bar"
           role="progressbar"
           aria-valuenow={value}
           aria-valuemin="0"
           aria-valuemax="100"
           style={{ width: value + '%' }}>
        {label ? <span>{value + '%'}</span> : null}
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  label: React.PropTypes.string,
  labelPosition: React.PropTypes.oneOf(['left', 'topRight']),
  value: React.PropTypes.number
};

export default ProgressBar;
