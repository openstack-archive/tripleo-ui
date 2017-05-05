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

import { addLocaleData, IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import React, { PropTypes } from 'react';
import de from 'react-intl/locale-data/de';
import es from 'react-intl/locale-data/es';
import id from 'react-intl/locale-data/id';
import ja from 'react-intl/locale-data/ja';
import ko from 'react-intl/locale-data/ko';
import zh from 'react-intl/locale-data/zh';

import I18nActions from '../../actions/I18nActions';
import deMessages from '../../../../i18n/locales/de.json';
import esMessages from '../../../../i18n/locales/es.json';
import idMessages from '../../../../i18n/locales/id.json';
import jaMessages from '../../../../i18n/locales/ja.json';
import kokrMessages from '../../../../i18n/locales/ko-KR.json';
import zhcnMessages from '../../../../i18n/locales/zh-CN.json';

import { getLanguage, getMessages } from '../../selectors/i18n';

export const MESSAGES = {
  'de': deMessages['de'],
  'es': esMessages['es'],
  'id': idMessages['id'],
  'ja': jaMessages['ja'],
  'ko-KR': kokrMessages['ko-KR'],
  'zh-CN': zhcnMessages['zh-CN']
};

class I18nProvider extends React.Component {
  constructor() {
    super();
    addLocaleData([...de, ...es, ...id, ...ja, ...ko, ...zh]);
  }

  componentDidMount() {
    this.props.detectLanguage(MESSAGES);
  }

  render() {
    return (
      <IntlProvider locale={this.props.language} messages={this.props.messages}>
        {this.props.children}
      </IntlProvider>
    );
  }
}

I18nProvider.propTypes = {
  children: PropTypes.node,
  detectLanguage: PropTypes.func.isRequired,
  language: PropTypes.string,
  messages: PropTypes.object.isRequired
};

I18nProvider.defaultProps = {
  messages: {}
};

const mapDispatchToProps = (dispatch) => {
  return {
    detectLanguage: (language) => dispatch(I18nActions.detectLanguage(language))
  };
};

const mapStateToProps = (state) => {
  return {
    language: getLanguage(state),
    messages: getMessages(state)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(I18nProvider);
