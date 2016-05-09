import Formsy from 'formsy-react';
import React from 'react';

class TableCheckBox extends React.Component {
  changeValue(event) {
    this.props.setValue(event.target.checked);
  }

  render() {
    return (
      <input type={this.props.type}
             name={this.props.name}
             ref={this.props.id}
             id={this.props.id}
             disabled={this.props.disabled}
             onChange={this.changeValue.bind(this)}
             checked={!!this.props.getValue()}
             value={this.props.getValue()}/>
    );
  }
}
TableCheckBox.propTypes = {
  disabled: React.PropTypes.bool.isRequired,
  getValue: React.PropTypes.func,
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  setValue: React.PropTypes.func,
  type: React.PropTypes.string
};
TableCheckBox.defaultProps = {
  disabled: false,
  type: 'checkbox'
};
export default Formsy.HOC(TableCheckBox);
