import Formsy from 'formsy-react';

/*
 * Custom validation rules used throughout the app.
 */
export default function initFormsy () {
  Formsy.addValidationRule('isJson', (values, value) => {
    try { return !!JSON.parse(value); }
    catch(e) { return false; }
  });
}
