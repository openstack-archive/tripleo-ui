import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Dropdown from '../ui/dropdown/Dropdown';
import DropdownToggle from '../ui/dropdown/DropdownToggle';
import DropdownItem from '../ui/dropdown/DropdownItem';
import { getEnabledLanguages } from '../../services/utils';
import I18nActions from '../../actions/I18nActions';
import { MESSAGES } from './messages';

const messages = defineMessages({
  language: {
    id: 'I18nDropdown.language',
    defaultMessage: 'Language'
  }
});

class I18nDropdown extends React.Component {
  _renderDropdownItems() {
    const configLanguages = getEnabledLanguages();
    const langList = Object.keys(configLanguages).sort(
      (a, b) => configLanguages[a] > configLanguages[b]
    );

    const enabledLang = this.props.language;

    return langList.map(lang => {
      const active = enabledLang === lang;
      return MESSAGES[lang] || lang === 'en'
        ? <DropdownItem
            key={`lang-${lang}`}
            active={active}
            onClick={this.props.chooseLanguage.bind(this, lang)}
          >
            {configLanguages[lang]}
          </DropdownItem>
        : null;
    });
  }

  render() {
    return (
      <Dropdown>
        <DropdownToggle>
          <FormattedMessage {...messages.language} /> <b className="caret" />
        </DropdownToggle>
        {this._renderDropdownItems()}
      </Dropdown>
    );
  }
}

I18nDropdown.propTypes = {
  chooseLanguage: PropTypes.func.isRequired,
  language: PropTypes.string
};

const mapStateToProps = state => {
  return {
    language: state.i18n.get('language', 'en')
  };
};

const mapDispatchToProps = dispatch => {
  return {
    chooseLanguage: language => dispatch(I18nActions.chooseLanguage(language))
  };
};

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(I18nDropdown)
);
