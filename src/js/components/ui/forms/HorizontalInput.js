import ClassNames from 'classnames';
import Formsy from 'formsy-react';
import PropTypes from 'prop-types';
import React from 'react';

import InputDescription from './InputDescription';
import InputErrorMessage from './InputErrorMessage';

class HorizontalInput extends React.Component {
  changeValue(event) {
    event.stopPropagation(); // https://github.com/christianalfoni/formsy-react/issues/203
    this.props.setValue(
      event.target.value === '' ? undefined : event.target.value
    );
  }

  // https://github.com/christianalfoni/formsy-react/issues/332
  getValue() {
    if (this.props.getValue() || this.props.getValue() === 0) {
      return this.props.getValue();
    }
    return '';
  }

  render() {
    let divClasses = ClassNames({
      'form-group': true,
      'has-error': this.props.showError(),
      // 'has-success': this.props.isValid(),
      required: this.props.isRequired()
    });

    return (
      <div className={divClasses}>
        <label
          htmlFor={this.props.name}
          className={`${this.props.labelColumnClasses} control-label`}
        >
          {this.props.title}
        </label>
        <div className={this.props.inputColumnClasses}>
          <input
            type={this.props.type}
            name={this.props.name}
            ref={this.props.name}
            id={this.props.name}
            className="form-control"
            onChange={this.changeValue.bind(this)}
            value={this.getValue()}
            placeholder={this.props.placeholder}
            min={this.props.min}
            max={this.props.max}
            disabled={this.props.disabled}
          />
          <InputErrorMessage getErrorMessage={this.props.getErrorMessage} />
          <InputDescription description={this.props.description} />
        </div>
      </div>
    );
  }
}
HorizontalInput.propTypes = {
  description: PropTypes.string,
  disabled: PropTypes.bool,
  getErrorMessage: PropTypes.func,
  getValue: PropTypes.func,
  inputColumnClasses: PropTypes.string.isRequired,
  isRequired: PropTypes.func,
  isValid: PropTypes.func,
  labelColumnClasses: PropTypes.string.isRequired,
  max: PropTypes.number,
  min: PropTypes.number,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  setValue: PropTypes.func,
  showError: PropTypes.func,
  title: PropTypes.string.isRequired,
  type: PropTypes.string
};
HorizontalInput.defaultProps = {
  inputColumnClasses: 'col-sm-10',
  labelColumnClasses: 'col-sm-2',
  type: 'text'
};
export default Formsy.HOC(HorizontalInput);
