import React, { PropTypes } from 'react';

export default class InputDescription extends React.Component {
  render() {
    const errorMessage = this.props.getErrorMessage();
    return errorMessage
      ? <span className="help-block">{errorMessage}</span>
      : null;
  }
}
InputDescription.propTypes = {
  getErrorMessage: PropTypes.func.isRequired
};
