import logger from '../services/logger';

export default {
  detectLanguage() {
    const locale = localStorage.getItem('language') ||
          (navigator.languages && navigator.languages[0]) ||
          navigator.language || navigator.userLanguage;
    // We only use the country part of the locale:
    const language = locale.substr(0, 2);
    return {
      type: 'DETECT_LANGUAGE',
      payload: language
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
