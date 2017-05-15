import PropTypes from 'prop-types';
import React from 'react';

export const Toolbar = ({ children, tableView }) => {
  if (tableView) {
    return (
      <div className="toolbar-pf row table-view-pf-toolbar">
        <div className="col-sm-12">
          {children}
        </div>
      </div>
    );
  } else {
    return (
      <div className="container-fluid">
        <div className="toolbar-pf row">
          <div className="col-sm-12">
            {children}
          </div>
        </div>
      </div>
    );
  }
};
Toolbar.propTypes = {
  children: PropTypes.node,
  tableView: PropTypes.bool.isRequired
};
Toolbar.defaultProps = {
  tableView: false
};

export const ToolbarActions = ({ children }) => (
  <div className="toolbar-pf-actions">
    {children}
  </div>
);
ToolbarActions.propTypes = {
  children: PropTypes.node
};

export const ToolbarResults = ({ children }) => (
  <div className="toolbar-pf-results row">
    <div className="col-sm-12">
      {children}
    </div>
  </div>
);
ToolbarResults.propTypes = {
  children: PropTypes.node
};
