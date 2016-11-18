import { addLocaleData, IntlProvider } from 'react-intl';
import React from 'react';
import ja from 'react-intl/locale-data/ja';

import jaMessages from '../../../../i18n/locales/ja.json';


const MESSAGES = {
  ja: jaMessages.messages
};


class I18nProvider extends React.Component {
  constructor() {
    super();
    addLocaleData([...ja]);
    this.state = {
      locale: localStorage.getItem('language') || 'en'
    };
  }

  render() {
    return (
      <IntlProvider locale={this.state.locale} messages={MESSAGES[this.state.locale]}>
        {this.props.children}
      </IntlProvider>
    );
  }
}

I18nProvider.propTypes = {
  children: React.PropTypes.node
};

export default I18nProvider;
