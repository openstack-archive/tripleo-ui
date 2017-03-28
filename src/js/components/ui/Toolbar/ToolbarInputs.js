import { Button } from 'react-bootstrap';
import React from 'react';

export const SortDirectionInput = ({ input: { onChange, value } }) => {
  return (
    <Button type="button" bsStyle="link" onClick={() => onChange(value === 'asc' ? 'desc' : 'asc')}>
      <span className={`fa fa-sort-alpha-${value}`}/>
    </Button>
  );
};
SortDirectionInput.propTypes = {
  children: React.PropTypes.node,
  input: React.PropTypes.object.isRequired
};

export const ViewSelectorInput = ({ input: { onChange, value } }) => (
  <div>
    <Button type="button" bsStyle="link" onClick={() => onChange('list')}>
      <i className="fa fa-th" />
    </Button>
    <Button type="button" bsStyle="link" onClick={() => onChange('cards')}>
      <i className="fa fa-th-large" />
    </Button>
    <Button type="button" bsStyle="link" onClick={() => onChange('table')}>
      <i className="fa fa-th-list" />
    </Button>
  </div>
);
ViewSelectorInput.propTypes = {
  input: React.PropTypes.object.isRequired
};
