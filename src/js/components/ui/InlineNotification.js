import ClassNames from 'classnames';
import React from 'react';

const InlineNotification = ({ children, title, type }) => {
  const notificationClasses = ClassNames({
    'alert': true,
    'alert-danger': type === 'error',
    'alert-warning': type === 'warning',
    'alert-success': type === 'success',
    'alert-info': type === 'info'
  });
  const iconClasses = ClassNames({
    'pficon': true,
    'pficon-error-circle-o': type === 'error',
    'pficon-warning-triangle-o': type === 'warning',
    'pficon-ok': type === 'success',
    'pficon-info': type === 'info'
  });

  return (
    <div className={notificationClasses}>
      <span className={iconClasses}></span>
      <strong>{title}</strong> {children}
    </div>
  );
};

InlineNotification.propTypes = {
  children: React.PropTypes.node,
  title: React.PropTypes.string.isRequired,
  type: React.PropTypes.oneOf(['error', 'warning', 'success', 'info']).isRequired
};
InlineNotification.defaultProps = {
  type: 'error'
};

export default InlineNotification;
