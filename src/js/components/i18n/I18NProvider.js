import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { addLocaleData, IntlProvider } from 'react-intl';
import React from 'react';

import frLocaleData from 'react-intl/locale-data/fr';

import frMessages from '../../../../i18n/locales/fr.json';


const messages = {
  'fr': frMessages
};


class I18NProvider extends React.Component {
  constructor() {
    super();
    addLocaleData(frLocaleData);
    this.state = {
      locale: localStorage.getItem('language') || 'en'
    }
  }

  render() {
    return (
      <div>
        <IntlProvider locale={this.state.locale} messages={messages[this.state.locale]}>
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
