import Formsy from 'formsy-react';

/*
 * Custom validation rules used throughout the app.
 */
export default function initFormsy () {
  /*
   * The field is valid if the current value is either empty
   * or a valid JSON string.
   */
  Formsy.addValidationRule('isJson', (values, value, otherField) => {
    try { return value === '' ? true : !!JSON.parse(value); }
    catch(e) { return false; }
  });
}
