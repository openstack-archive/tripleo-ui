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

import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import { Form, Field, reduxForm, submit } from 'redux-form';
import NodesActions from '../../actions/NodesActions';
import { nodesInProgress } from '../../selectors/nodes';
import Loader from '../ui/Loader';
import Modal from '../ui/Modal';
import { isValidSubnet } from '../../utils/regex';

const messages = defineMessages({
  discoverNodes: {
    id: 'DiscoverAndEnrollNodesDialog.discoverNodes',
    defaultMessage: 'Discover and Enroll Nodes'
  },
  inProgress: {
    id: 'DiscoverAndEnrollNodesDialog.inProgress',
    defaultMessage: 'Discovering and enrolling nodes.  This may take several minutes...'
  },
  cancel: {
    id: 'DiscoverAndEnrollNodesDialog.cancel',
    defaultMessage: 'Cancel'
  },
  invalidSubnet: {
    id: 'DiscoverAndEnrollNodesDialog.invalidSubnet',
    defaultMessage: 'Invalid subnet.'
  },
  fieldRequired: {
    id: 'DiscoverAndEnrollNodesDialog.fieldRequired',
    defaultMessage: 'This field is required.'
  },
  ipmiUsername: {
    id: 'DiscoverAndEnrollNodesDialog.ipmiUsername',
    defaultMessage: 'IPMI username'
  },
  ipmiPassword: {
    id: 'DiscoverAndEnrollNodesDialog.ipmiPassword',
    defaultMessage: 'IPMI password'
  },
  subnet: {
    id: 'DiscoverAndEnrollNodesDialog.subnet',
    defaultMessage: 'Subnet'
  }
});

const renderField = ({
  input,
  label,
  type,
  placeholder,
  meta: { touched, error }
}) => {
  error = touched && error;
  const classes = error ? 'form-group has-error' : 'form-group';
  return (
    <div className={classes}>
      <label className="col-sm-2 control-label">{label}</label>
      <div className="col-sm-10">
        <input
          {...input}
          placeholder={placeholder}
          type={type}
          className="form-control"
        />
        {error && <span className="help-block">{error}</span>}
      </div>
    </div>
  );
};

renderField.propTypes = {
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.object,
  placeholder: PropTypes.string,
  type: PropTypes.string
};

class DiscoverAndEnrollNodesForm extends React.Component {
  update(data) {
    this.props.updateForm(data);
  }

  render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      invalid,
      nodesInProgress
    } = this.props;
    const inProgress = nodesInProgress.isEmpty();
    return (
      <Modal dialogClasses="modal-lg">
        <Form
          className="form-horizontal"
          onSubmit={handleSubmit(this.update.bind(this))}
        >
          <div className="modal-header">
            <Link to="/nodes" type="button" className="close">
              <span className="pficon pficon-close" />
            </Link>
            <h4 className="modal-title">
              <FormattedMessage {...messages.discoverNodes} />
            </h4>
          </div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-10">
                <p>
                  Provided a subnet and credentials that are common for machines on
                  that subnet, discovery can auto populate a list of nodes.
                </p>
              </div>
            </div>

            <Field
              label={this.props.intl.formatMessage(messages.ipmiUsername)}
              name="username"
              type="text"
              component={renderField}
              placeholder="admin"
            />

            <Field
              label={this.props.intl.formatMessage(messages.ipmiPassword)}
              name="password"
              type="password"
              component={renderField}
            />

            <Field
              label={this.props.intl.formatMessage(messages.subnet)}
              name="subnet"
              type="text"
              component={renderField}
              placeholder="10.0.1.0/24"
            />

          </div>
          <div className="modal-footer">
            <Loader
              inline
              loaded={inProgress}
              content={this.props.intl.formatMessage(messages.inProgress)}
            />
            &nbsp;
            <Link to="/nodes" type="button" className="btn btn-default">
              <FormattedMessage {...messages.cancel} />
            </Link>
            <button
              type="submit"
              disabled={pristine || submitting || invalid || !inProgress}
              className="btn btn-primary"
            >
              Start
            </button>
          </div>

        </Form>
      </Modal>
    );
  }
}

DiscoverAndEnrollNodesForm.propTypes = {
  handleSubmit: PropTypes.func,
  intl: PropTypes.object,
  invalid: PropTypes.bool,
  nodesInProgress: PropTypes.object,
  pristine: PropTypes.bool,
  submitting: PropTypes.bool,
  updateForm: PropTypes.func
};

const mapStateToProps = (state, ownProps) => ({
  nodesInProgress: nodesInProgress(state)
});

const mapDispatchToProps = dispatch => {
  return {
    updateForm: (data, inputFields, redirectPath) => {
      dispatch(
        NodesActions.startDiscoverAndEnrollNodes(
          data.username,
          data.password,
          data.subnet
        )
      );
    },
    submit: () => dispatch(submit('discoverAndEnrollNodes'))
  };
};

const validate = values => {
  const errors = {};

  if (!values.subnet) {
    errors.subnet = <FormattedMessage {...messages.fieldRequired} />;
  }

  if (values.subnet && !isValidSubnet(values.subnet)) {
    errors.subnet = <FormattedMessage {...messages.invalidSubnet} />;
  }

  return errors;
};

const form = reduxForm({
  form: 'discoverAndEnrollNodes',
  validate
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(form(DiscoverAndEnrollNodesForm))
);
