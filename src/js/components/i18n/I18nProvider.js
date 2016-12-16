import { addLocaleData, IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import React from 'react';
import ja from 'react-intl/locale-data/ja';

import I18nActions from '../../actions/I18nActions';
import jaMessages from '../../../../i18n/locales/ja.json';
import { getLanguage, getMessages } from '../../selectors/i18n';

export const MESSAGES = {
  ja: jaMessages.ja
};

class I18nProvider extends React.Component {
  constructor() {
    super();
    addLocaleData([...ja]);
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
  children: React.PropTypes.node,
  detectLanguage: React.PropTypes.func.isRequired,
  language: React.PropTypes.string,
  messages: React.PropTypes.object.isRequired
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
