/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import { debounce } from 'lodash';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';

import FormErrorList from '../ui/forms/FormErrorList';

class NodesAssignmentForm extends React.Component {
  render() {
    const { error, handleSubmit, children } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <FormErrorList errors={error ? [error] : []} />
        {children}
      </form>
    );
  }
}
NodesAssignmentForm.propTypes = {
  children: PropTypes.node,
  currentPlanName: PropTypes.string.isRequired,
  error: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  updateParameters: PropTypes.func.isRequired
};

const update = (data, updateParameters, currentPlanName) =>
  updateParameters(currentPlanName, data);

const debouncedUpdate = debounce(update, 1500);

const form = reduxForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  form: 'nodesAssignment',
  onChange: (
    values,
    dispatch,
    { currentPlanName, dirty, submit, submitting, updateParameters }
  ) => {
    if (dirty && !submitting) {
      // debouncedUpdate(values, updateParameters, currentPlanName);
      // hacky solution to make handleSubmit work with up to date values
      // related -> https://github.com/erikras/redux-form/issues/883
      setTimeout(submit);
    } else {
      debouncedUpdate.cancel();
    }
  },
  onSubmit: (values, dispatch, props) => {
    debouncedUpdate(values, props.updateParameters, props.currentPlanName);
  }
});

export default form(NodesAssignmentForm);
