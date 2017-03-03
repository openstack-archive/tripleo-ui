import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { getAppConfig } from '../../services/utils';

class LanguageInput extends React.Component {
  _renderOptions() {
    const configLanguages = getAppConfig().languages || {};
    const langList = Object.keys(configLanguages).sort(
      (a, b) => configLanguages[a] > configLanguages[b]
    );

    return langList.map(lang => {
      return (
        <option key={`lang-${lang}`} value={lang}>
          {configLanguages[lang]}
        </option>
      );
    });
  }

  _onChange(event) {
    this.props.chooseLanguage(event.currentTarget.value);
  }

  render() {
    return (
      <div className="form-group">
        <label
          className="col-sm-2 col-md-2 control-label"
          htmlFor={this.props.name}
        />
        <div className="col-sm-4 col-sm-offset-6 col-md-4 col-md-offset-6">
          <select
            className="combobox form-control"
            name={this.props.name}
            value={this.props.language}
            autoFocus={this.props.autoFocus}
            onChange={this._onChange.bind(this)}
          >
            {this._renderOptions()}
          </select>
        </div>
      </div>
    );
  }
}

LanguageInput.propTypes = {
  autoFocus: PropTypes.bool,
  chooseLanguage: PropTypes.func.isRequired,
  language: PropTypes.string,
  name: PropTypes.string.isRequired
};

LanguageInput.defaultProps = {
  autoFocus: false
};

export default injectIntl(LanguageInput);
