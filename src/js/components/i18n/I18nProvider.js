import { addLocaleData, IntlProvider } from 'react-intl';
import React from 'react';
import jaLocaleData from 'react-intl/locale-data/ja';

import jaMessages from '../../../../i18n/locales/ja.json';


const MESSAGES = {
  ja: jaMessages.messages
};


class I18nProvider extends React.Component {
  constructor() {
    super();
    addLocaleData(jaLocaleData);
    this.state = {
      locale: localStorage.getItem('language') || 'en'
    };
  }

  render() {
    return (
      <IntlProvider locale={this.state.locale} messages={MESSAGES[this.state.locale]}>
        {this.props.router}
      </IntlProvider>
    );
  }
}

I18nProvider.propTypes = {
  router: React.PropTypes.element.isRequired
};

export default I18nProvider;
