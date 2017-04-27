import React, { PropTypes } from 'react';
import { includes } from 'lodash';
import ClassNames from 'classnames';

export const ValidationStatusIcon = ({ status, triggerValidationAction }) => {
  const statusIconClass = ClassNames({
    'list-view-pf-icon-md':               true,
    'running fa fa-stop-circle':          status === 'running',
    'pficon pficon-error-circle-o front': status === 'failed',
    'pficon pficon-ok front':             status === 'success',
    'fa fa-play-circle':                  includes(['new', 'paused'], status),
    'pficon pficon-help':                 status === 'error'
  });

  const runValidationIconClass = 'list-view-pf-icon-md fa fa-play-circle back';

  switch (true) {
  case (includes(['new', 'running', 'paused'], status)):
    return (
      <a className="link"
         onClick={triggerValidationAction}>
        <span className={statusIconClass}/>
      </a>
    );
  case (includes(['success', 'failed'], status)):
    return (
      <a className="link flip-container"
         onClick={triggerValidationAction}>
        <div className="flipper">
          <span className={statusIconClass}/>
          <span className={runValidationIconClass}/>
        </div>
      </a>
    );
  default:
    return (
      <a className="link flip-container"
         onClick={triggerValidationAction}>
        <div className="flipper">
          <span className={statusIconClass}/>
          <span className={runValidationIconClass}/>
        </div>
      </a>
    );
  }
};
ValidationStatusIcon.propTypes = {
  status: PropTypes.string,
  triggerValidationAction: PropTypes.func.isRequired
};
