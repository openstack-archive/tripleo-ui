import { Button } from 'react-bootstrap';
import React from 'react';

export const SortDirectionInput = ({ input: { onChange, value }, title }) => {
  return (
    <Button
      title={title}
      type="button"
      bsStyle="link"
      onClick={() => onChange(value === 'asc' ? 'desc' : 'asc')}>
      <span className={`fa fa-sort-alpha-${value}`}/>
    </Button>
  );
};
SortDirectionInput.propTypes = {
  children: React.PropTypes.node,
  input: React.PropTypes.object.isRequired,
  title: React.PropTypes.string
};

const getIconClass = (optionKey) => {
  switch (optionKey) {
  case 'cards':
    return 'fa fa-th-large';
  case 'list':
    return 'fa fa-th-list';
  default:
    return 'fa fa-th';
  }
};

export const ContentViewSelectorInput = ({ input: { onChange, value }, options }) => {
  return (
    <div>
      {Object.keys(options).map(k => (
        <Button key={k} type="button" bsStyle="link" title={options[k]} onClick={() => onChange(k)}>
          <i className={getIconClass(k)} />
        </Button>
      ))}
    </div>
  );
};
ContentViewSelectorInput.propTypes = {
  input: React.PropTypes.object.isRequired,
  options: React.PropTypes.object.isRequired
};
