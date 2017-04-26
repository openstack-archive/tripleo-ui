import React from 'react';

export const ActiveFiltersList = ({ children, clearAllLabel, handleClearAll, label }) => {
  if (children.length > 0) {
    return (
      <span className="toolbar-active-filters-list">
        <p>{label}</p>
        <ul className="list-inline">
          {children}
        </ul>
        <p><a className="link" onClick={() => handleClearAll()}>{clearAllLabel}</a></p>
      </span>
    );
  } else {
    return null;
  }
};
ActiveFiltersList.propTypes = {
  children: React.PropTypes.node,
  clearAllLabel: React.PropTypes.string.isRequired,
  handleClearAll: React.PropTypes.func.isRequired,
  label: React.PropTypes.string.isRequired
};
ActiveFiltersList.defaultProps = {
  clearAllLabel: 'Clear All Filters',
  label: 'Active Filters:'
};

export const ActiveFilter = ({ filterBy, filterString, onRemove }) => (
  <li>
    <span className="label label-info">
      {filterBy
        ? `${filterBy}: ${filterString}`
        : filterString}
      <a className="link" onClick={onRemove}>
        <span className="pficon pficon-close"/>
      </a>
    </span>
  </li>
);
ActiveFilter.propTypes = {
  filterBy: React.PropTypes.string,
  filterString: React.PropTypes.string.isRequired,
  onRemove: React.PropTypes.func.isRequired
};
