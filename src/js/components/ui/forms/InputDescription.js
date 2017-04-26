import React, { PropTypes } from 'react';

export default class InputDescription extends React.Component {
  render() {
    return this.props.description ? (
      <small className="help-block">{this.props.description}</small>
    ) : null;
  }
}
InputDescription.propTypes = {
  description: PropTypes.string
};
