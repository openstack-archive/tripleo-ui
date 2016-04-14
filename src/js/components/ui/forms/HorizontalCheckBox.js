import ClassNames from 'classnames';
import Formsy from 'formsy-react';
import React from 'react';

class HorizontalCheckBox extends React.Component {
  changeValue(event) {
    this.props.setValue(event.target.checked);
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
      <small>{description}</small>
    ) : false;
  }

  render() {
    let divClasses = ClassNames({
      'form-group': true,
      'has-error': this.props.showError(),
      'required': this.props.showRequired()
    });

    return (
      <div className={divClasses}>
        <label htmlFor={this.props.name}
               className={`${this.props.labelColumnClasses} control-label`}>
          {this.props.title}
        </label>
        <div className={this.props.inputColumnClasses}>
          <div className="checkbox">
            <label>
              <input type={this.props.type}
                     name={this.props.name}
                     ref={this.props.id}
                     id={this.props.id}
                     onChange={this.changeValue.bind(this)}
                     checked={!!this.props.getValue()}
                     value={this.props.getValue()}/>
              {this.renderDescription()}
              {this.renderErrorMessage()}
            </label>
          </div>
        </div>
      </div>
    );
  }
}
HorizontalCheckBox.propTypes = {
  description: React.PropTypes.string,
  getErrorMessage: React.PropTypes.func,
  getValue: React.PropTypes.func,
  id: React.PropTypes.string.isRequired,
  inputColumnClasses: React.PropTypes.string.isRequired,
  isRequired: React.PropTypes.func,
  isValid: React.PropTypes.func,
  labelColumnClasses: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  placeholder: React.PropTypes.string,
  setValue: React.PropTypes.func,
  showError: React.PropTypes.func,
  showRequired: React.PropTypes.func,
  title: React.PropTypes.string.isRequired,
  type: React.PropTypes.string
};
HorizontalCheckBox.defaultProps = {
  type: 'checkbox'
};
export default Formsy.HOC(HorizontalCheckBox);
