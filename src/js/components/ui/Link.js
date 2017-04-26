import PropTypes from 'prop-types';
import React from 'react';
import {Link as ReactRouterLink} from 'react-router';

export default class Link extends React.Component {
  render() {
    return (
      <ReactRouterLink
        {...this.props}
        onClick={(e) =>  this.props.disabled ? e.preventDefault(): null}
        className={this.props.className + (this.props.disabled ? ' disabled' : '')} />
    );
  }
}

Link.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool
};

Link.defaultProps = {
  className: '',
  disabled: false
};
