import React from 'react';
import * as _ from 'lodash';

export default class FormErrorList extends React.Component {
  renderErrors() {
    const { errors } = this.props;
    if(errors.length > 1) {
      const errorList = errors.map((error, index) => {
        return (
          <li key={index}>
            {error.title} {error.message}
          </li>
        );
      });
      return (
        <div>
          <strong>{`${errors.length} Errors Found:`}</strong>
          <ul>
            {errorList}
          </ul>
        </div>

      );
    } else {
      return (
        <p>
          <strong>{errors[0].title}</strong>
          <br/>
          {errors[0].message}
        </p>
      );
    }
  }

  render() {
    if (_.isEmpty(this.props.errors)) {
      return null;
    } else {
      return (
        <div className="toast-pf alert alert-danger" role="alert">
          <span className="pficon pficon-error-circle-o" aria-hidden="true"></span>
          {this.renderErrors()}
        </div>
      );
    }
  }
}
FormErrorList.propTypes = {
  errors: React.PropTypes.array.isRequired
};
