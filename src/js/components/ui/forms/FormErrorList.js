import React from 'react';
import * as _ from 'lodash';

import Notification from '../../notifications/Notification';

export default class FormErrorList extends React.Component {
  render() {
    let errors = this.props.errors.map((error, index) => {
      return (
        <Notification key={index}
                      title={error.title}
                      message={error.message}
                      dismissable={false}
                      persistent
                      type={error.type}/>
      );
    });

    if (_.isEmpty(errors)) {
      return null;
    } else {
      return (
        <div>
          {errors}
        </div>
      );
    }
  }
}
FormErrorList.propTypes = {
  errors: React.PropTypes.array.isRequired
};
