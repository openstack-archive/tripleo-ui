import React, { PropTypes } from 'react';
import * as _ from 'lodash';

import FormErrorList from './FormErrorList';

export default class ModalFormErrorList extends React.Component {
  render() {
    if (_.isEmpty(this.props.errors)) {
      return null;
    } else {
      return (
        <div className="modal-form-error-list">
          <FormErrorList errors={this.props.errors} />
        </div>
      );
    }
  }
}
ModalFormErrorList.propTypes = {
  errors: PropTypes.array.isRequired
};
