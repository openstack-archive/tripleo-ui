import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const InlineNotification = ({ children, title, type }) => {
  const notificationClasses = ClassNames({
    alert: true,
    'alert-danger': type === 'error',
    'alert-warning': type === 'warning',
    'alert-success': type === 'success',
    'alert-info': type === 'info'
  });
  const iconClasses = ClassNames({
    pficon: true,
    'pficon-error-circle-o': type === 'error',
    'pficon-warning-triangle-o': type === 'warning',
    'pficon-ok': type === 'success',
    'pficon-info': type === 'info'
  });

  return (
    <div className={notificationClasses}>
      <span className={iconClasses} />
      <strong>{title}</strong> {children}
    </div>
  );
};

InlineNotification.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  type: PropTypes.oneOf(['error', 'warning', 'success', 'info']).isRequired
};
InlineNotification.defaultProps = {
  type: 'error'
};

export default InlineNotification;
