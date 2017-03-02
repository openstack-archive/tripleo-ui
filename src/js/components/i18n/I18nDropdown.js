import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
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

class I18nDropdown extends React.Component {
  _renderDropdownItems() {
    const configLanguages = getAppConfig().languages || [];

    return configLanguages.map((lang) => {
      // Here, lang = ['en', 'English']
      return (MESSAGES[lang[0]] || lang === 'en') ? (
        <DropdownItem key={`lang-${lang[0]}`}
                      onClick={this.props.chooseLanguage.bind(this, lang[0])}>
          {lang[1]}
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

export default injectIntl(connect(null, mapDispatchToProps)(I18nDropdown));
