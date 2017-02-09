import { connect } from 'react-redux';
import { defineMessages, FormattedMessage } from 'react-intl';
import React from 'react';

import Dropdown from '../ui/dropdown/Dropdown';
import DropdownToggle from '../ui/dropdown/DropdownToggle';
import DropdownItem from '../ui/dropdown/DropdownItem';
import { getAppConfig } from '../../services/utils';
import I18nActions from '../../actions/I18nActions';
import { MESSAGES } from './I18nProvider';

const messages = defineMessages({
  language: {
    id: 'I18nDropdown.language',
    defaultMessage: 'Language'
  }
});

const languages = {
  'en': 'English',
  'en-GB': 'British English',
  'es': 'Spanish',
  'ja': 'Japanese',
  'ko-KR': 'Korean',
  'zh-CN': 'Simplified Chinese'
};

class I18nDropdown extends React.Component {
  _renderDropdownItems() {
    const configLanguages = getAppConfig().languages || [];
    return configLanguages.map((lang) => {
      return (MESSAGES[lang] || lang === 'en') ? (
        <DropdownItem key={`lang-${lang}`} onClick={this.props.chooseLanguage.bind(this, lang)}>
          {languages[lang]}
        </DropdownItem>
      ) : null;
    });
  }

  render() {
    return (
      <Dropdown>
        <DropdownToggle>
          <FormattedMessage {...messages.language}/> <b className="caret"></b>
        </DropdownToggle>
        {this._renderDropdownItems()}
      </Dropdown>
    );
  }
}

I18nDropdown.propTypes = {
  chooseLanguage: React.PropTypes.func.isRequired
};

const mapDispatchToProps = (dispatch) => {
  return {
    chooseLanguage: (language) => dispatch(I18nActions.chooseLanguage(language))
  };
};

export default connect(null, mapDispatchToProps)(I18nDropdown);
