import React from 'react';
import { connect } from 'react-redux';
import Formsy from 'formsy-react';
import { injectIntl } from 'react-intl';
import I18nActions from '../../../actions/I18nActions';
import { getAppConfig } from '../../../services/utils';

class LanguageInput extends React.Component {

  _renderOptions() {
    const configLanguages = getAppConfig().languages || {};
    const langList = Object.keys(configLanguages).sort((a , b) =>
      configLanguages[a] > configLanguages[b]);

    const enabledLang = this.props.language;

    return langList.map((lang) => {
      const selected = enabledLang === lang ? 'selected' : '';
      return (
      <option key={`lang-${lang}`} value={lang} selected={selected}>
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
        <label className="col-sm-2 col-md-2 control-label" htmlFor={this.props.name}>
        </label>
        <div className="col-sm-10 col-md-10">
          <select className="combobox form-control" name={this.props.name}
            autoFocus={this.props.autoFocus}
            onChange={this._onChange.bind(this)}>
            {this._renderOptions()}
          </select>
        </div>
      </div>
    );
  }
}

LanguageInput.propTypes = {
  autoFocus: React.PropTypes.bool,
  chooseLanguage: React.PropTypes.func.isRequired,
  getErrorMessage: React.PropTypes.func,
  getValue: React.PropTypes.func,
  language: React.PropTypes.string,
  name: React.PropTypes.string.isRequired,
  setValue: React.PropTypes.func
};

LanguageInput.defaultProps = {
  autoFocus: false
};

const mapDispatchToProps = (dispatch) => {
  return {
    chooseLanguage: (language) => dispatch(I18nActions.chooseLanguage(language))
  };
};

export default Formsy.HOC(
  injectIntl(connect(null, mapDispatchToProps)(LanguageInput))
);
