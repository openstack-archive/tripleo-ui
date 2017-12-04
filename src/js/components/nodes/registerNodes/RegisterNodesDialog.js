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

import {
  arrayPush,
  arrayRemove,
  getFormValues,
  getFormSyncErrors,
  isInvalid,
  isPristine,
  isSubmitting,
  reset,
  SubmissionError,
  submit
} from 'redux-form';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { last, omit } from 'lodash';
import { Link } from 'react-router-dom';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import uuid from 'uuid';
import when from 'when';
import { withRouter } from 'react-router-dom';

import { handleErrors } from '../../../actions/ErrorActions';
import { OverlayLoader } from '../../ui/Loader';
import NotificationActions from '../../../actions/NotificationActions';
import RegisterNodesActions from '../../../actions/RegisterNodesActions';
import RegisterNodesForm from './RegisterNodesForm';
import NodesFileUpload from './NodesFileUpload';
import NodeTab from './NodeTab';
import Modal from '../../ui/Modal';

import MistralApiService from '../../../services/MistralApiService';
import MistralConstants from '../../../constants/MistralConstants';

const messages = defineMessages({
  noNodesToRegister: {
    id: 'RegisterNodesDialog.noNodesToRegister',
    defaultMessage: '"No Nodes To Register"'
  },
  addANodeManually: {
    id: 'RegisterNodesDialog.addANodeManually',
    defaultMessage: 'Add a node manually or upload nodes from a file.'
  },
  registerNodes: {
    id: 'RegisterNodesDialog.registerNodes',
    defaultMessage: 'Register Nodes'
  },
  registeringNodes: {
    id: 'RegisterNodesDialog.registeringNodes',
    defaultMessage: 'Registering Nodes...'
  },
  addNew: {
    id: 'RegisterNodesDialog.addNew',
    defaultMessage: 'Add New',
    description: 'Small button, to add a new Node'
  },
  or: {
    id: 'RegisterNodesDialog.or',
    defaultMessage: 'or',
    description: 'Placed between two buttons: "Add New" <or> "Upload From File"'
  },
  cancel: {
    id: 'RegisterNodesDialog.cancel',
    defaultMessage: 'Cancel'
  }
});

class RegisterNodesDialog extends React.Component {
  constructor() {
    super();
    this.state = { selectedNodeId: undefined };
  }

  componentDidMount() {
    // handle selecting node when user closes and reopens the dialog
    const lastNode = last(this.props.nodesToRegister);
    lastNode && this.selectNode(lastNode.uuid);
  }

  addNode(node) {
    const newNode = Object.assign(
      { uuid: uuid.v4(), pm_type: 'pxe_ipmitool' },
      node
    );
    this.props.addNode(newNode);
    this.selectNode(newNode.uuid);
  }

  removeNode(uuid, e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.removeNode(this.getNodeIndexById(uuid));
    // handle deleting selected Node
    if (uuid === this.state.selectedNodeId) {
      const lastNode = last(
        this.props.nodesToRegister.filter(node => node.uuid !== uuid)
      );
      this.selectNode(lastNode ? lastNode.uuid : undefined);
    }
  }

  selectNode(uuid) {
    this.setState({ selectedNodeId: uuid });
  }

  getNodeIndexById(uuid) {
    return this.props.nodesToRegister.findIndex(n => n.uuid === uuid);
  }

  renderNodeTabs() {
    return this.props.nodesToRegister.map((node, index) => (
      <NodeTab
        key={index}
        node={node}
        invalid={!!this.props.syncErrors.nodes[index]}
        isActive={this.state.selectedNodeId === node.uuid}
        selectNode={this.selectNode.bind(this, node.uuid)}
        removeNode={this.removeNode.bind(this, node.uuid)}
      />
    ));
  }

  handleFormSubmit(values, dispatch, props) {
    // TODO(jtomasek): remove this once tripleo-common supports passing uuid from client
    // errors on incoming message will include uuids so we can act om nodes list page
    const nodesToRegister = values.nodes.map(node => omit(node, 'uuid'));

    // run tripleo.baremetal.validate_nodes action here explicitly to be able to catch
    // validation issues and then close the modal and reset form
    return dispatch(
      MistralApiService.runAction(MistralConstants.BAREMETAL_VALIDATE_NODES, {
        nodes_json: nodesToRegister
      })
    )
      .then(response =>
        dispatch(
          MistralApiService.runWorkflow(
            MistralConstants.BAREMETAL_REGISTER_OR_UPDATE,
            {
              nodes_json: nodesToRegister,
              kernel_name: 'bm-deploy-kernel',
              ramdisk_name: 'bm-deploy-ramdisk'
            }
          )
        )
      )
      .then(response => {
        this.props.resetForm();
        this.props.history.push('/nodes');
        this.props.startNodesRegistration(nodesToRegister);
      })
      .catch(error => {
        dispatch(handleErrors(error, 'Nodes registration failed', false));
        return when.reject(new SubmissionError({ _error: error.message }));
      });
  }

  render() {
    const {
      intl: { formatMessage },
      notify,
      resetForm,
      pristine,
      invalid,
      submitForm,
      submitting
    } = this.props;
    return (
      <Modal dialogClasses="modal-xl">
        <div className="modal-header">
          <Link to="/nodes" type="button" className="close">
            <span className="pficon pficon-close" />
          </Link>
          <h4 className="modal-title">
            <FormattedMessage {...messages.registerNodes} />
          </h4>
        </div>
        <div className="container-fluid">
          <OverlayLoader
            containerClassName="row row-eq-height"
            loaded={!submitting}
            content={formatMessage(messages.registeringNodes)}
            componentProps={{ className: 'row row-eq-height' }}
          >
            <div className="col-sm-4 col-lg-3 sidebar-pf sidebar-pf-left">
              <div className="nav-stacked-actions">
                <Button onClick={e => this.addNode()}>
                  <span className="fa fa-plus" />
                  {' '}
                  <FormattedMessage {...messages.addNew} />
                </Button>
                &nbsp; <FormattedMessage {...messages.or} /> &nbsp;
                <NodesFileUpload
                  notify={notify}
                  addNode={this.addNode.bind(this)}
                />
              </div>
              <ul className="nav nav-pills nav-stacked nav-arrows">
                {this.renderNodeTabs().reverse()}
              </ul>
            </div>
            <div className="col-sm-8 col-lg-9">
              <RegisterNodesForm
                onSubmit={this.handleFormSubmit.bind(this)}
                selectedNodeIndex={this.getNodeIndexById(
                  this.state.selectedNodeId
                )}
              />
            </div>
          </OverlayLoader>
        </div>
        <div className="modal-footer">
          <Link
            to="/nodes"
            onClick={() => resetForm()}
            type="button"
            className="btn btn-default"
          >
            <FormattedMessage {...messages.cancel} />
          </Link>
          <button
            disabled={pristine || invalid || submitting}
            onClick={() => submitForm()}
            className="btn btn-primary"
            type="button"
          >
            <FormattedMessage {...messages.registerNodes} />
          </button>
        </div>
      </Modal>
    );
  }
}
RegisterNodesDialog.propTypes = {
  addNode: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  intl: PropTypes.object,
  invalid: PropTypes.bool.isRequired,
  nodesToRegister: PropTypes.array.isRequired,
  notify: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  removeNode: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  startNodesRegistration: PropTypes.func.isRequired,
  submitForm: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  syncErrors: PropTypes.object
};
RegisterNodesDialog.defaultProps = {
  syncErrors: { nodes: [] }
};

function mapStateToProps(state) {
  return {
    syncErrors: getFormSyncErrors('registerNodesForm')(state),
    invalid: isInvalid('registerNodesForm')(state),
    pristine: isPristine('registerNodesForm')(state),
    nodesToRegister: (getFormValues('registerNodesForm')(state) || {
      nodes: []
    }).nodes,
    submitting: isSubmitting('registerNodesForm')(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addNode: node => dispatch(arrayPush('registerNodesForm', 'nodes', node)),
    removeNode: nodeIndex =>
      dispatch(arrayRemove('registerNodesForm', 'nodes', nodeIndex)),
    resetForm: () => dispatch(reset('registerNodesForm')),
    startNodesRegistration: nodes =>
      dispatch(RegisterNodesActions.startNodesRegistration(nodes)),
    submitForm: () => dispatch(submit('registerNodesForm')),
    notify: notification => dispatch(NotificationActions.notify(notification))
  };
}

export default injectIntl(
  withRouter(connect(mapStateToProps, mapDispatchToProps)(RegisterNodesDialog))
);
