import { addLocaleData, IntlProvider } from 'react-intl';
import { connect } from 'react-redux';
import React from 'react';

import I18nActions from '../../actions/I18nActions';

import { MESSAGES, LOCALE_DATA } from './messages';

import { getLanguage, getMessages } from '../../selectors/i18n';

class I18nProvider extends React.Component {
  constructor() {
    super();
    addLocaleData(LOCALE_DATA);
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
