import { getAppConfig } from '../services/utils';

export default {
  detectLanguage(messages) {
    const configLanguages = getAppConfig().languages;
    let language;
    // If the configuration contains only one language and there
    // are messages for it, return it;
    if(configLanguages && configLanguages.length === 1 && messages[configLanguages[0]]) {
      language = configLanguages[0];
    }
    else {
      const locale = localStorage.getItem('language') ||
            (navigator.languages && navigator.languages[0]) ||
            navigator.language || navigator.userLanguage;
      // If the locale contains the country but we can't find
      // messages for it then we only use the country part:
      language = (locale.match(/^[A-Za-z]+-[A-Za-z]+$/) && !messages[locale])
        ? locale.split('-')[0]
        : locale;
    }
    return {
      type: 'DETECT_LANGUAGE',
      payload: {
        language,
        messages
      }
    };
  },

  chooseLanguage(language) {
    localStorage.setItem('language', language);
    return {
      type: 'CHOOSE_LANGUAGE',
      payload: language
    };
  }
};
