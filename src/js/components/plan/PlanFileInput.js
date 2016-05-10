import ClassNames from 'classnames';
import Formsy from 'formsy-react';
import React from 'react';

class PlanFileInput extends React.Component {
  constructor() {
    super();
    this.state = {
      progress: 0
    };
  }

  componentDidUpdate() {
    if(this.props.uploadType === 'folder') {
      // Attributes not in react's whitelist need to be added after mounting.
      this.refs[this.props.name].setAttribute('webkitdirectory', 'webkitdirectory');
      this.refs[this.props.name].setAttribute('multiple', 'multiple');
    }
    else {
      this.refs[this.props.name].removeAttribute('webkitdirectory');
      this.refs[this.props.name].removeAttribute('multiple');
    }
  }

  processFolderFiles(inputFiles) {
    let files = [];
    let processedFilesCount = 0;
    for(let i=0, l=inputFiles.length; i<l; i++) {
      let reader = new FileReader();
      let file = inputFiles[i];
      reader.onload = (f => {
        return e => {
          if(file.name.match(/(\.yaml|\.json|\.pp|\.sh)$/)) {
            let obj = {
              name: f.webkitRelativePath.replace(/^[^\/]*\//, ''),
              content: e.target.result
            };
            files.push(obj);
          }
          processedFilesCount += 1;
          this.setState({progress: Math.round(100/l*processedFilesCount)}, () => {
            // if the last file is processed, setValue -> triggers onChange on Formsy.Form
            if(processedFilesCount === l) {
              this.props.setValue(files);
              this.setState({progress: 0});
            }
          });
        };
      })(file);
      reader.readAsText(file);
    }
  }

  processTarball(file) {
    this.props.setValue([{ name: file.name, file: file }]);
  }

  processFiles(event) {
    if(this.props.uploadType === 'folder') {
      this.processFolderFiles.bind(this)(event.target.files);
    }
    else {
      this.processTarball.bind(this)(event.target.files[0]);
    }
  }

  renderErrorMessage() {
    let errorMessage = this.props.getErrorMessage();
    return errorMessage ? (
      <span className="help-block">{errorMessage}</span>
    ) : false;
  }

  renderDescription() {
    let description = this.props.description;
    return description ? (
      <small className="help-block">{description}</small>
    ) : false;
  }

  renderProgress() {
    return this.state.progress > 0 ? (
      <div className="progress active help-block">
        <div className="progress-bar" style={{width: `${this.state.progress}%`}}></div>
      </div>
    ) : false;
  }

  render() {
    let divClasses = ClassNames({
      'form-group': true,
      'has-error': this.props.showError(),
      'has-success': this.props.isValid(),
      'required': this.props.isRequired()
    });

    return(
      <div className={divClasses}>
        <label htmlFor={this.props.name}
               className={`${this.props.labelColumnClasses} control-label`}>
          {this.props.title}
        </label>
        <div className={this.props.inputColumnClasses}>
          <input type="file"
                 name={this.props.name}
                 ref={this.props.name}
                 id={this.props.name}
                 onChange={this.processFiles.bind(this)}/>
          {this.renderProgress()}
          {this.renderErrorMessage()}
          {this.renderDescription()}
        </div>
      </div>
    );
  }
}
PlanFileInput.propTypes = {
  description: React.PropTypes.string,
  getErrorMessage: React.PropTypes.func,
  getValue: React.PropTypes.func,
  inputColumnClasses: React.PropTypes.string.isRequired,
  isRequired: React.PropTypes.func,
  isValid: React.PropTypes.func,
  labelColumnClasses: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  setValue: React.PropTypes.func,
  showError: React.PropTypes.func,
  title: React.PropTypes.string.isRequired,
  uploadType: React.PropTypes.string
};
PlanFileInput.defaultProps = {
  inputColumnClasses: 'col-sm-10',
  labelColumnClasses: 'col-sm-2',
  uploadType: 'tarball'
};

export default Formsy.HOC(PlanFileInput);
