import Formsy from 'formsy-react';
import React, { PropTypes } from 'react';

import InputErrorMessage from './InputErrorMessage';

class LoginInput extends React.Component {
  changeValue(event) {
    this.props.setValue(event.target.value);
  }

  render() {
    return (
      <div className="form-group">
        <label
          className="col-sm-2 col-md-2 control-label"
          htmlFor={this.props.name}
        >
          {this.props.title}
        </label>
        <div className="col-sm-10 col-md-10">
          <input
            type={this.props.type}
            name={this.props.name}
            ref={this.props.name}
            className="form-control"
            id={this.props.name}
            onChange={this.changeValue.bind(this)}
            value={this.props.getValue() || ''}
            placeholder={this.props.placeholder}
            autoFocus={this.props.autoFocus}
          />
          <InputErrorMessage getErrorMessage={this.props.getErrorMessage} />
        </div>
      </div>
    );
  }
}
LoginInput.propTypes = {
  autoFocus: PropTypes.bool,
  getErrorMessage: PropTypes.func,
  getValue: PropTypes.func,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  setValue: PropTypes.func,
  title: PropTypes.string.isRequired,
  type: PropTypes.string
};
LoginInput.defaultProps = {
  autoFocus: false,
  type: 'text'
};
export default Formsy.HOC(LoginInput);
