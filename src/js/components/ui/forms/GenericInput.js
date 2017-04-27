import ClassNames from 'classnames';
import Formsy from 'formsy-react';
import React, { PropTypes } from 'react';

import InputDescription from './InputDescription';
import InputErrorMessage from './InputErrorMessage';

class GenericInput extends React.Component {
  changeValue(event) {
    this.props.setValue(event.target.value);
  }

  render() {
    let divClasses = ClassNames({
      'form-group': true,
      'has-error': this.props.showError(),
      'has-success': this.props.isValid(),
      'required': this.props.isRequired()
    });

    return (
      <div className={divClasses}>
        <label htmlFor={this.props.name} className="control-label">{this.props.title}</label>
        <input type={this.props.type}
               name={this.props.name}
               ref={this.props.name}
               id={this.props.name}
               className="form-control"
               onChange={this.changeValue.bind(this)}
               value={this.props.getValue()}
               placeholder={this.props.placeholder}
               disabled={this.props.disabled} />
        <InputErrorMessage getErrorMessage={this.props.getErrorMessage} />
        <InputDescription description={this.props.description} />
      </div>
    );
  }
}
GenericInput.propTypes = {
  description: PropTypes.string,
  disabled: PropTypes.bool,
  getErrorMessage: PropTypes.func,
  getValue: PropTypes.func,
  isRequired: PropTypes.func,
  isValid: PropTypes.func,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  setValue: PropTypes.func,
  showError: PropTypes.func,
  title: PropTypes.string.isRequired,
  type: PropTypes.string
};
GenericInput.defaultProps = {
  type: 'text'
};
export default Formsy.HOC(GenericInput);
