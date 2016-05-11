import ClassNames from 'classnames';
import Formsy from 'formsy-react';
import React from 'react';

class HorizontalArrayInput extends React.Component {
  changeValue(event) {
    event.stopPropagation(); // https://github.com/christianalfoni/formsy-react/issues/203
    this.props.setValue(event.target.value.split(','));
  }

  getValue() {
    return this.props.getValue().toString();
  }

  renderErrorMessage() {
    let errorMessage = this.props.getErrorMessage();
    return errorMessage ? (
      <span className="help-block">{errorMessage}</span>
    ) : false;
  }

  renderDescription() {
    let description = this.props.description;
    return description ? (
      <small className="help-block">{description}</small>
    ) : false;
  }

  render() {
    let divClasses = ClassNames({
      'form-group': true,
      'has-error': this.props.showError(),
      // 'has-success': this.props.isValid(),
      'required': this.props.isRequired()
    });

    return (
      <div className={divClasses}>
        <label htmlFor={this.props.name}
               className={`${this.props.labelColumnClasses} control-label`}>
          {this.props.title}
        </label>
        <div className={this.props.inputColumnClasses}>
          <input type={this.props.type}
                 name={this.props.name}
                 ref={this.props.name}
                 id={this.props.name}
                 className="form-control"
                 onChange={this.changeValue.bind(this)}
                 value={this.getValue()}
                 placeholder={this.props.placeholder}
                 min={this.props.min}
                 max={this.props.max}
                 disabled={this.props.disabled} />
          {this.renderErrorMessage()}
          {this.renderDescription()}
        </div>
      </div>
    );
  }
}
HorizontalArrayInput.propTypes = {
  description: React.PropTypes.string,
  disabled: React.PropTypes.bool,
  getErrorMessage: React.PropTypes.func,
  getValue: React.PropTypes.func,
  inputColumnClasses: React.PropTypes.string.isRequired,
  isRequired: React.PropTypes.func,
  isValid: React.PropTypes.func,
  labelColumnClasses: React.PropTypes.string.isRequired,
  max: React.PropTypes.number,
  min: React.PropTypes.number,
  name: React.PropTypes.string.isRequired,
  placeholder: React.PropTypes.string,
  setValue: React.PropTypes.func,
  showError: React.PropTypes.func,
  title: React.PropTypes.string.isRequired,
  type: React.PropTypes.string
};
HorizontalArrayInput.defaultProps = {
  inputColumnClasses: 'col-sm-10',
  labelColumnClasses: 'col-sm-2',
  type: 'text'
};
export default Formsy.HOC(HorizontalArrayInput);
