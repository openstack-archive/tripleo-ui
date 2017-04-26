import ClassNames from 'classnames';
import Formsy from 'formsy-react';
import PropTypes from 'prop-types';
import React from 'react';

import InputDescription from './InputDescription';
import InputErrorMessage from './InputErrorMessage';

class HorizontalTextarea extends React.Component {
  changeValue(event) {
    this.props.setValue(event.target.value);
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
          <textarea type={this.props.type}
                    name={this.props.name}
                    ref={this.props.name}
                    id={this.props.name}
                    rows={this.props.rows}
                    className="form-control"
                    onChange={this.changeValue.bind(this)}
                    value={this.props.getValue() || ''}
                    placeholder={this.props.placeholder}
                    disabled={this.props.disabled} />
          <InputErrorMessage getErrorMessage={this.props.getErrorMessage} />
          <InputDescription description={this.props.description} />
        </div>
      </div>
    );
  }
}
HorizontalTextarea.propTypes = {
  description: PropTypes.string,
  disabled: PropTypes.bool,
  getErrorMessage: PropTypes.func,
  getValue: PropTypes.func,
  inputColumnClasses: PropTypes.string.isRequired,
  isRequired: PropTypes.func,
  isValid: PropTypes.func,
  labelColumnClasses: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  rows: PropTypes.number,
  setValue: PropTypes.func,
  showError: PropTypes.func,
  title: PropTypes.string.isRequired,
  type: PropTypes.string
};
HorizontalTextarea.defaultProps = {
  inputColumnClasses: 'col-sm-10',
  labelColumnClasses: 'col-sm-2',
  rows: 3,
  type: 'text'
};
export default Formsy.HOC(HorizontalTextarea);
