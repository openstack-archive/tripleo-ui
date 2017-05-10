import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  maxValue: {
    id: 'reduxForm.validations.maxValue',
    defaultMessage: 'Maximum value is {max, number}.'
  },
  minValue: {
    id: 'reduxForm.validations.minValue',
    defaultMessage: 'Minimum value is {min, number}.'
  },
  number: {
    id: 'reduxForm.validations.number',
    defaultMessage: 'Value needs to be a number.'
  }
});

export const minValue = (min, message) => value =>
  value && value < min ? message : undefined;

export const maxValue = (max, message) => value =>
  value && value > max ? message : undefined;

export const number = message => value =>
  value && isNaN(Number(value)) ? message : undefined;
