import Formsy from 'formsy-react';
import PropTypes from 'prop-types';
import React from 'react';

import InputDescription from './InputDescription';
import InputErrorMessage from './InputErrorMessage';

class HorizontalSelect extends React.Component {
  changeValue(event) {
    event.stopPropagation();
    this.props.setValue(event.target.value);
  }

  render() {
    return (
      <div className="form-group">
        <label
          htmlFor={this.props.name}
          className={`${this.props.labelColumnClasses} control-label`}
        >
          {this.props.title}
        </label>
        <div className={this.props.inputColumnClasses}>
          <select
            name={this.props.name}
            ref={this.props.name}
            id={this.props.name}
            className="form-control"
            onChange={this.changeValue.bind(this)}
            value={this.props.getValue()}
          >
            {this.props.children}
          </select>
          <InputErrorMessage getErrorMessage={this.props.getErrorMessage} />
          <InputDescription description={this.props.description} />
        </div>
      </div>
    );
  }
}
HorizontalSelect.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element
  ]),
  description: PropTypes.string,
  getErrorMessage: PropTypes.func,
  getValue: PropTypes.func,
  inputColumnClasses: PropTypes.string.isRequired,
  labelColumnClasses: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  setValue: PropTypes.func,
  title: PropTypes.string.isRequired
};
HorizontalSelect.defaultProps = {
  inputColumnClasses: 'col-sm-10',
  labelColumnClasses: 'col-sm-2'
};
export default Formsy.HOC(HorizontalSelect);
