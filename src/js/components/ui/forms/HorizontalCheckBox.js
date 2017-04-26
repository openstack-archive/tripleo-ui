import ClassNames from 'classnames';
import Formsy from 'formsy-react';
import PropTypes from 'prop-types';
import React from 'react';

import InputDescription from './InputDescription';
import InputErrorMessage from './InputErrorMessage';

class HorizontalCheckBox extends React.Component {
  changeValue(event) {
    this.props.setValue(event.target.checked);
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
              <InputErrorMessage getErrorMessage={this.props.getErrorMessage} />
              <InputDescription description={this.props.description} />
            </label>
          </div>
        </div>
      </div>
    );
  }
}
HorizontalCheckBox.propTypes = {
  description: PropTypes.string,
  getErrorMessage: PropTypes.func,
  getValue: PropTypes.func,
  id: PropTypes.string.isRequired,
  inputColumnClasses: PropTypes.string.isRequired,
  isRequired: PropTypes.func,
  isValid: PropTypes.func,
  labelColumnClasses: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  setValue: PropTypes.func,
  showError: PropTypes.func,
  showRequired: PropTypes.func,
  title: PropTypes.string.isRequired,
  type: PropTypes.string
};
HorizontalCheckBox.defaultProps = {
  type: 'checkbox'
};
export default Formsy.HOC(HorizontalCheckBox);
