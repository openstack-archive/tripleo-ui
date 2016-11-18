import { connect } from 'react-redux';
import { addLocaleData, IntlProvider } from 'react-intl';
import React from 'react';
import jaLocaleData from 'react-intl/locale-data/ja';

import jaMessages from '../../../../i18n/locales/ja.json';


const MESSAGES = {
  ja: jaMessages
};


class I18NProvider extends React.Component {
  constructor() {
    super();
    addLocaleData(jaLocaleData);
    this.state = {
      locale: localStorage.getItem('language') || 'en'
    };
  }

  render() {
    return (
      <div>
        <IntlProvider locale={this.state.locale} messages={MESSAGES[this.state.locale].messages}>
        {this.props.router}
      </IntlProvider>

      </div>
    );
  }
}

I18NProvider.propTypes = {
  router: React.PropTypes.element.isRequired
};

export function mapStateToProps(state) {
  return {
  };
}

export function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(I18NProvider);
