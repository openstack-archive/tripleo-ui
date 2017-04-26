import ClassNames from 'classnames';
import React, { PropTypes } from 'react';

export const ListView = ({ children }) => (
  <div className="list-group list-view-pf list-view-pf-view">
    {children}
  </div>
);
ListView.propTypes = {
  children: PropTypes.node
};

export const ListViewItem = ({ children, stacked, expanded }) => {
  const classes = ClassNames({
    'list-group-item': true,
    'list-view-pf-expand-active': expanded,
    'list-view-pf-stacked': stacked
  });
  return (
    <div className={classes}>
      {children}
    </div>
  );
};
ListViewItem.propTypes = {
  children: PropTypes.node,
  expanded: PropTypes.bool.isRequired,
  stacked: PropTypes.bool.isRequired
};
ListViewItem.defaultProps = {
  expanded: false,
  stacked: false
};

export const ListViewCheckbox = ({ children }) => (
  <div className="list-view-pf-checkbox">
    {children}
  </div>
);
ListViewCheckbox.propTypes = {
  children: PropTypes.node
};

export const ListViewExpand = ({ expanded  }) => {
  const classes = ClassNames({
    'fa fa-angle-right': true,
    'fa-angle-down': expanded
  });
  return (
    <a className="list-view-pf-expand">
      <span className={classes} />
    </a>
  );
};
ListViewExpand.propTypes = {
  expanded: PropTypes.bool.isRequired
};
ListViewExpand.defaultProps = {
  expanded: false
};

export const ListViewActions = ({ children }) => (
  <div className="list-view-pf-actions">
    {children}
  </div>
);
ListViewActions.propTypes = {
  children: PropTypes.node
};

export const ListViewMainInfo = ({ children }) => (
  <div className="list-view-pf-main-info">
    {children}
  </div>
);
ListViewMainInfo.propTypes = {
  children: PropTypes.node
};

export const ListViewLeft = ({ children }) => (
  <div className="list-view-pf-left">
    {children}
  </div>
);
ListViewLeft.propTypes = {
  children: PropTypes.node
};

export const ListViewIcon = ({ icon, size }) => {
  return (
    <span className={`list-view-pf-icon-${size} ${icon}`} />
  );
};
ListViewIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

export const ListViewBody = ({ children }) => (
  <div className="list-view-pf-body">
    {children}
  </div>
);
ListViewBody.propTypes = {
  children: PropTypes.node
};

export const ListViewDescription = ({ children }) => (
  <div className="list-view-pf-description">
    {children}
  </div>
);
ListViewDescription.propTypes = {
  children: PropTypes.node
};

export const ListViewDescriptionHeading = ({ children }) => (
  <div className="list-group-item-heading">
    {children}
  </div>
);
ListViewDescriptionHeading.propTypes = {
  children: PropTypes.node
};

export const ListViewDescriptionText = ({ children }) => (
  <div className="list-group-item-text">
    {children}
  </div>
);
ListViewDescriptionText.propTypes = {
  children: PropTypes.node
};

export const ListViewAdditionalInfo = ({ children }) => (
  <div className="list-view-pf-additional-info">
    {children}
  </div>
);
ListViewAdditionalInfo.propTypes = {
  children: PropTypes.node
};

export const ListViewAdditionalInfoItem = ({ children }) => (
  <div className="list-view-pf-additional-info-item">
    {children}
  </div>
);
ListViewAdditionalInfoItem.propTypes = {
  children: PropTypes.node
};
