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

const messages = defineMessages({
  discoverNodes: {
    id: 'DiscoverAndEnrollNodesDialog.discoverNodes',
    defaultMessage: 'Discover and Enroll Nodes'
  },
  inProgress: {
    id: 'DiscoverAndEnrollNodesForm.inProgress',
    defaultMessage: 'Discovering and enrolling nodes.  This may take several minutes...'
  },
  cancel: {
    id: 'DiscoverAndEnrollNodesForm.cancel',
    defaultMessage: 'Cancel'
  }
});

class DiscoverAndEnrollNodesForm extends React.Component {
  update(data) {
    this.props.updateForm(data);
  }

  render() {
    const { handleSubmit, pristine, submitting, nodesInProgress } = this.props;
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

            <div className="form-group">
              <label className="col-sm-2 control-label">IPMI username</label>
              <div className="col-sm-10">
                <Field
                  component="input"
                  type="text"
                  name="username"
                  className="form-control"
                  placeholder="admin"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-2 control-label">IPMI password</label>
              <div className="col-sm-10">
                <Field
                  type="password"
                  component="input"
                  name="password"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-2 control-label">Subnet</label>
              <div className="col-sm-10">
                <Field
                  type="text"
                  component="input"
                  name="subnet"
                  className="form-control"
                  placeholder="10.0.1.0/24"
                />
              </div>
            </div>

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
              disabled={pristine || submitting || !inProgress}
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

const form = reduxForm({
  form: 'discoverAndEnrollNodes'
});

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(form(DiscoverAndEnrollNodesForm))
);
