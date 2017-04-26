import PropTypes from 'prop-types';
import React from 'react';

export const Toolbar = ({ children }) => {
  return (
    <div className="container-fluid">
      <div className="toolbar-pf row">
        <div className="col-sm-12">
          {children}
        </div>
      </div>
    </div>
  );
};
Toolbar.propTypes = {
  children: PropTypes.node
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
