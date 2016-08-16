import ClassNames from 'classnames';
import Formsy from 'formsy-react';
import React from 'react';

import InputDescription from './InputDescription';
import InputErrorMessage from './InputErrorMessage';

class HorizontalInput extends React.Component {
  changeValue(event) {
    event.stopPropagation(); // https://github.com/christianalfoni/formsy-react/issues/203
    this.props.setValue(event.target.value === '' ? undefined : event.target.value);
  }

  // https://github.com/christianalfoni/formsy-react/issues/332
  getValue() {
    if(this.props.getValue() || this.props.getValue() === 0) {
      return this.props.getValue();
    }
    return '';
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
          <InputErrorMessage getErrorMessage={this.props.getErrorMessage} />
          <InputDescription description={this.props.description} />
        </div>
      </div>
    );
  }
}
HorizontalInput.propTypes = {
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
HorizontalInput.defaultProps = {
  inputColumnClasses: 'col-sm-10',
  labelColumnClasses: 'col-sm-2',
  type: 'text'
};
export default Formsy.HOC(HorizontalInput);
