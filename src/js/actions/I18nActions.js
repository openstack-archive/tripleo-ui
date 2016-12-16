export default {
  detectLanguage(messages) {
    const locale = localStorage.getItem('language') ||
          (navigator.languages && navigator.languages[0]) ||
          navigator.language || navigator.userLanguage;
    // If the locale contains the country but we can't find
    // messages for it then we only use the country part:
    const language = (locale.match(/^[A-Za-z]+-[A-Za-z]+$/) && !messages[locale])
      ? locale.split('-')[0]
      : locale;
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
