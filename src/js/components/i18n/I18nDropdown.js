/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Dropdown from '../ui/dropdown/Dropdown';
import DropdownToggle from '../ui/dropdown/DropdownToggle';
import DropdownItem from '../ui/dropdown/DropdownItem';
import I18nActions from '../../actions/I18nActions';
import { MESSAGES } from './messages';
import { getEnabledLanguages } from '../../services/utils';

const messages = defineMessages({
  language: {
    id: 'I18nDropdown.language',
    defaultMessage: 'Language'
  }
});

class I18nDropdown extends React.Component {
  _renderDropdownItems() {
    const enabledLang = this.props.language;
    return getEnabledLanguages()
      .map((langName, langKey) => {
        const active = enabledLang === langKey;
        return MESSAGES[langKey] || langKey === 'en'
          ? <DropdownItem
              key={`lang-${langKey}`}
              active={active}
              onClick={this.props.chooseLanguage.bind(this, langKey)}
            >
              {langName}
            </DropdownItem>
          : null;
      })
      .toList();
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
