import PropTypes from 'prop-types';
import React from 'react';

export const ActiveFiltersList = ({
  children,
  clearAllLabel,
  handleClearAll,
  label
}) => {
  if (children.length > 0) {
    return (
      <span className="toolbar-pf-active-filters">
        <p>{label}&nbsp;</p>
        <ul className="list-inline">
          {children}
        </ul>
        <p>
          <a className="link" onClick={() => handleClearAll()}>
            {clearAllLabel}
          </a>
        </p>
      </span>
    );
  } else {
    return null;
  }
};
ActiveFiltersList.propTypes = {
  children: PropTypes.node,
  clearAllLabel: PropTypes.string.isRequired,
  handleClearAll: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired
};
ActiveFiltersList.defaultProps = {
  clearAllLabel: 'Clear All Filters',
  label: 'Active Filters:'
};

export const ActiveFilter = ({ filterBy, filterString, onRemove }) => (
  <li>
    <span className="label label-info">
      {filterBy ? `${filterBy}: ${filterString}` : filterString}
      <a className="link" onClick={onRemove}>
        <span className="pficon pficon-close" />
      </a>
    </span>
  </li>
);
ActiveFilter.propTypes = {
  filterBy: PropTypes.string,
  filterString: PropTypes.string.isRequired,
  onRemove: PropTypes.func.isRequired
};
