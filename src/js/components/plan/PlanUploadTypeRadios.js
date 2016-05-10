import React from 'react';

export default class PlanUploadTypeRadios extends React.Component {

  render() {
    return (
      <div className="form-group">
        <label className={`${this.props.labelColumnClasses} control-label`}>
          {this.props.title}
        </label>

        <div className={this.props.inputColumnClasses}>
          <label className="radio-inline" htmlFor="checkbox-tarball">
            <input type="radio"
                   id="checkbox-tarball"
                   name="uploadType"
                   value="tarball"
                   onChange={this.props.setUploadType}
                   defaultChecked/> Tar Archive (tar.gz)
          </label>
          <label className="radio-inline" htmlFor="checkbox-folder">
            <input ref="checkbox-folder"
                   type="radio"
                   id="checkbox-folder"
                   name="uploadType"
                   onChange={this.props.setUploadType}
                   value="folder"/> Local Folder
          </label>
        </div>
      </div>
    );
  }
}

PlanUploadTypeRadios.propTypes = {
  inputColumnClasses: React.PropTypes.string.isRequired,
  labelColumnClasses: React.PropTypes.string.isRequired,
  setUploadType: React.PropTypes.func.isRequired,
  title: React.PropTypes.string.isRequired,
  uploadType: React.PropTypes.string.isRequired
};
