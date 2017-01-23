import Formsy from 'formsy-react';
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
        <label htmlFor={this.props.name}
               className={`${this.props.labelColumnClasses} control-label`}>
          {this.props.title}
        </label>
        <div className={this.props.inputColumnClasses}>
          <select name={this.props.name}
                  ref={this.props.name}
                  id={this.props.name}
                  className="form-control"
                  onChange={this.changeValue.bind(this)}
                  value={this.props.getValue()}>
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
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.element),
    React.PropTypes.element
  ]),
  description: React.PropTypes.string,
  getErrorMessage: React.PropTypes.func,
  getValue: React.PropTypes.func,
  inputColumnClasses: React.PropTypes.string.isRequired,
  labelColumnClasses: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  setValue: React.PropTypes.func,
  title: React.PropTypes.string.isRequired
};
HorizontalSelect.defaultProps = {
  inputColumnClasses: 'col-sm-10',
  labelColumnClasses: 'col-sm-2'
};
export default Formsy.HOC(HorizontalSelect);
