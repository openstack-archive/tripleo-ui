import Formsy from 'formsy-react';
import React from 'react';

class LoginInput extends React.Component {
  changeValue(event) {
    this.props.setValue(event.target.value);
  }

  renderErrorMessage() {
    let errorMessage = this.props.getErrorMessage();
    return errorMessage ? (
      <span className="help-block">{errorMessage}</span>
    ) : false;
  }

  render() {
    return (
      <div className="form-group">
        <label className="col-sm-2 col-md-2 control-label" htmlFor={this.props.name}>
          {this.props.title}
        </label>
        <div className="col-sm-10 col-md-10">
          <input type={this.props.type}
                 name={this.props.name}
                 ref={this.props.name}
                 className="form-control"
                 id={this.props.name}
                 onChange={this.changeValue.bind(this)}
                 value={this.props.getValue()}
                 placeholder={this.props.placeholder}
                 autoFocus={this.props.autoFocus}
          />
          {this.renderErrorMessage()}
        </div>
      </div>
    );
  }
}
LoginInput.propTypes = {
  autoFocus: React.PropTypes.bool,
  getErrorMessage: React.PropTypes.func,
  getValue: React.PropTypes.func,
  name: React.PropTypes.string.isRequired,
  placeholder: React.PropTypes.string,
  setValue: React.PropTypes.func,
  title: React.PropTypes.string.isRequired,
  type: React.PropTypes.string
};
LoginInput.defaultProps = {
  autoFocus: false,
  type: 'text'
};
export default Formsy.HOC(LoginInput);
