import React from 'react';

export default class HorizontalStaticText extends React.Component {
  render() {
    return (
      <div className="form-group">
        <label className={`${this.props.labelColumnClasses} control-label`}>
          {this.props.title}
        </label>
        <div className={this.props.inputColumnClasses}>
          <p className="form-control-static">{this.props.text}</p>
        </div>
      </div>
    );
  }
}
HorizontalStaticText.propTypes = {
  inputColumnClasses: React.PropTypes.string,
  labelColumnClasses: React.PropTypes.string,
  text: React.PropTypes.string,
  title: React.PropTypes.string
};
