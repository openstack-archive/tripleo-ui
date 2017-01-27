import { addLocaleData, IntlProvider } from 'react-intl';
import React from 'react';
import ja from 'react-intl/locale-data/ja';

import jaMessages from '../../../../i18n/locales/ja.json';


const MESSAGES = {
  ja: jaMessages.ja
};


class I18nProvider extends React.Component {
  constructor() {
    super();
    addLocaleData([...ja]);
    this.state = {
      locale: 'en'
    };
  }

  componentWillMount() {
    const locale = localStorage.getItem('language') ||
                   (navigator.languages && navigator.languages[0]) ||
                   navigator.language || navigator.userLanguage;
    // We only use the country part of the locale:
    const language = locale.substr(0, 2);
    if(MESSAGES[language]) {
      this.setState({ locale: language });
    }
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
