export const mockGetIntl = {
  getIntl: () => {
    return {
      formatMessage: msgObj => msgObj.defaultMessage
    };
  }
};
