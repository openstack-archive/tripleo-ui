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

import { Button } from 'patternfly-react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { reduxForm } from 'redux-form';
import PropTypes from 'prop-types';
import React from 'react';

import { OverlayLoader } from '../ui/Loader';
import FloatingToolbar from '../ui/FloatingToolbar';
import FormErrorList from '../ui/forms/FormErrorList';

const messages = defineMessages({
  saveChanges: {
    id: 'NodesAssignmentForm.saveChanges',
    defaultMessage: 'Save Changes'
  },
  cancel: {
    id: 'NodesAssignmentForm.cancel',
    defaultMessage: 'Cancel'
  },
  updatingParameters: {
    id: 'ParametersForm.updatingParameters',
    defaultMessage: 'Updating configuration...'
  },
  nodeCountsErrorTitle: {
    id: 'NodesAssignmentForm.nodeCountsErrorTitle',
    defaultMessage: "The desired Node counts don't fit available nodes."
  },
  nodeCountsErrorMessage: {
    id: 'NodesAssignmentForm.nodeCountsErrorMessage',
    defaultMessage: 'Please adjust the node counts.'
  }
});

class NodesAssignmentForm extends React.Component {
  render() {
    const {
      handleSubmit,
      children,
      intl: { formatMessage },
      invalid,
      pristine,
      dirty,
      submitting,
      reset,
      valid
    } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <OverlayLoader
          loaded={!submitting}
          content={formatMessage(messages.updatingParameters)}
        >
          {invalid && (
            <div className="col-sm-12">
              <FormErrorList
                errors={[
                  {
                    title: formatMessage(messages.nodeCountsErrorTitle),
                    message: formatMessage(messages.nodeCountsErrorMessage)
                  }
                ]}
              />
            </div>
          )}
          {children}
          {valid &&
            dirty &&
            !submitting && (
              <FloatingToolbar bottom right>
                <Button
                  disabled={invalid || pristine || submitting}
                  bsStyle="primary"
                  type="submit"
                >
                  <FormattedMessage {...messages.saveChanges} />
                </Button>{' '}
                <Button onClick={() => reset()}>
                  <FormattedMessage {...messages.cancel} />
                </Button>
              </FloatingToolbar>
            )}
        </OverlayLoader>
      </form>
    );
  }
}
NodesAssignmentForm.propTypes = {
  children: PropTypes.node,
  currentPlanName: PropTypes.string.isRequired,
  dirty: PropTypes.bool.isRequired,
  error: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  invalid: PropTypes.bool.isRequired,
  pristine: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  updateNodesAssignment: PropTypes.func.isRequired,
  valid: PropTypes.bool.isRequired
};

const form = reduxForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  form: 'nodesAssignment',
  onSubmit: (values, dispatch, { updateNodesAssignment, currentPlanName }) => {
    updateNodesAssignment(currentPlanName, values);
  }
});

export default injectIntl(form(NodesAssignmentForm));
