import ClassNames from 'classnames';
import Formsy from 'formsy-react';
import PropTypes from 'prop-types';
import React from 'react';

import InputDescription from './InputDescription';
import InputErrorMessage from './InputErrorMessage';

class GenericCheckBox extends React.Component {
  changeValue(event) {
    this.props.setValue(event.target.checked);
  }

  render() {
    let divClasses = ClassNames({
      checkbox: this.props.type === 'checkbox',
      radio: this.props.type === 'radio',
      'has-error': this.props.showError(),
      required: this.props.showRequired()
    });

    return (
      <div className={divClasses}>
        <label htmlFor={this.props.id} className="control-label">
          <input
            type={this.props.type}
            name={this.props.name}
            ref={this.props.id}
            id={this.props.id}
            onChange={this.changeValue.bind(this)}
            checked={!!this.props.getValue()}
            value={this.props.getValue()}
          />
          {this.props.title}
        </label>
        <InputErrorMessage getErrorMessage={this.props.getErrorMessage} />
        <InputDescription description={this.props.description} />
      </div>
    );
  }
}
GenericCheckBox.propTypes = {
  description: PropTypes.string,
  getErrorMessage: PropTypes.func,
  getValue: PropTypes.func,
  id: PropTypes.string.isRequired,
  isRequired: PropTypes.func,
  isValid: PropTypes.func,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  setValue: PropTypes.func,
  showError: PropTypes.func,
  showRequired: PropTypes.func,
  title: PropTypes.string,
  type: PropTypes.string
};
GenericCheckBox.defaultProps = {
  type: 'checkbox'
};
export default Formsy.HOC(GenericCheckBox);
