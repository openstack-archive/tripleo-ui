import { addValidator } from 'redux-form-validators';

/**
 * Validator to check that value is an array of strngs which match the format
 * e.g. Comma separated list of MAC addresses parsed as array of strings
 */
export const arrayOfFormat = addValidator({
  validator: ({ with: wit, message }, value, allValues) => {
    if (
      value.constructor === Array &&
      value.reduce(
        (result, currentValue) => (result ? true : !currentValue.match(wit)),
        false
      )
    ) {
      return (
        message || {
          id: 'form.errors.arrayOfFormat',
          defaultMessage: 'must be list of valid values'
        }
      );
    }
  }
});
