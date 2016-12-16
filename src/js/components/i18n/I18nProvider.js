import { addLocaleData, IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import React from 'react';
import ja from 'react-intl/locale-data/ja';

import I18nActions from '../../actions/I18nActions';
import jaMessages from '../../../../i18n/locales/ja.json';
import { getLanguage } from '../../selectors/i18n';


export const MESSAGES = {
  ja: jaMessages.messages
};


class I18nProvider extends React.Component {
  constructor() {
    super();
    addLocaleData([...ja]);
  }

  componentDidMount() {
    this.props.detectLanguage();
  }

  render() {
    // If messages is undefined, this will fall back to en:
    const messages = MESSAGES[this.props.language];
    return (
      <IntlProvider locale={this.props.language} messages={messages}>
        {this.props.children}
      </IntlProvider>
    );
  }
}

I18nProvider.propTypes = {
  children: React.PropTypes.node,
  detectLanguage: React.PropTypes.func.isRequired,
  language: React.PropTypes.string
};

const mapDispatchToProps = (dispatch) => {
  return {
    detectLanguage: () => dispatch(I18nActions.detectLanguage())
  };
};

const mapStateToProps = (state) => {
  return {
    language: getLanguage(state)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(I18nProvider);
