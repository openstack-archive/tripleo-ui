import ClassNames from 'classnames';
import Formsy from 'formsy-react';
import React from 'react';

import InputDescription from './InputDescription';
import InputErrorMessage from './InputErrorMessage';

class GroupedCheckBox extends React.Component {
  changeValue(event) {
    this.props.onChange(event.target.checked, this.props.name);
    this.props.setValue(event.target.checked);
  }

  render() {
    let divClasses = ClassNames({
      'checkbox': this.props.type === 'checkbox',
      'radio': this.props.type === 'radio',
      'has-error': this.props.showError(),
      'required': this.props.showRequired()
    });

    return (
      <div className={divClasses}>
        <label htmlFor={this.props.id} className="control-label">
          <input type={this.props.type}
                 name={this.props.name}
                 ref={this.props.id}
                 id={this.props.id}
                 onChange={this.changeValue.bind(this)}
                 checked={!!this.props.getValue()}
                 value={this.props.getValue()}/>
          {this.props.title}
        </label>
        <InputErrorMessage getErrorMessage={this.props.getErrorMessage} />
        <InputDescription description={this.props.description} />
      </div>
    );
  }
}
GroupedCheckBox.propTypes = {
  description: React.PropTypes.string,
  getErrorMessage: React.PropTypes.func,
  getValue: React.PropTypes.func,
  id: React.PropTypes.string.isRequired,
  isRequired: React.PropTypes.func,
  isValid: React.PropTypes.func,
  name: React.PropTypes.string.isRequired,
  onChange: React.PropTypes.func.isRequired,
  placeholder: React.PropTypes.string,
  setValue: React.PropTypes.func,
  showError: React.PropTypes.func,
  showRequired: React.PropTypes.func,
  title: React.PropTypes.string.isRequired,
  type: React.PropTypes.string
};
GroupedCheckBox.defaultProps = {
  type: 'checkbox'
};
export default Formsy.HOC(GroupedCheckBox);
