import Formsy from 'formsy-react';
import React from 'react';

export default class App extends React.Component {
  render() {
    return (
      <div>
        {this.props.children}
      </div>
    );
  }
}
App.propTypes = {
  children: React.PropTypes.element
};

/*
 * Custom validation rules used throughout the whole app.
 */
Formsy.addValidationRule('isJson', (values, value) => {
  try { return !!JSON.parse(value); }
  catch(e) { return false; }
});
