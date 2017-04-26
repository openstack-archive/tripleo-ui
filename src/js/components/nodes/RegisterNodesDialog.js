import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ClassNames from 'classnames';
import { Link } from 'react-router';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import uuid from 'node-uuid';

import BlankSlate from '../ui/BlankSlate';
import { allNodesToRegisterAreValid,
         getIronicNodesfromNodesToRegister } from '../../selectors/registerNodes';
import { NodeToRegister } from '../../immutableRecords/nodes';
import ModalFormErrorList from '../ui/forms/ModalFormErrorList';
import Loader from '../ui/Loader';
import NotificationActions from '../../actions/NotificationActions';
import RegisterNodesActions from '../../actions/RegisterNodesActions';
import RegisterNodeForm from './RegisterNodeForm';
import Tab from '../ui/Tab';
import TabPane from '../ui/TabPane';
import Modal from '../ui/Modal';

const messages = defineMessages({
  invalidJson: {
    id: 'RegisterNodesDialog.invalidJson',
    defaultMessage: 'Invalid JSON'
  },
  csvUnsupported: {
    id: 'RegisterNodesDialog.csvUnsupported',
    defaultMessage: 'CSV Upload Unsupported'
  },
  selectedFileUnsupported: {
    id: 'RegisterNodesDialog.selectedFileUnsupported',
    defaultMessage: 'The selected file format is not supported yet.'
  },
  unsupportedFileFormat: {
    id: 'RegisterNodesDialog.unsupportedFileFormat',
    defaultMessage: 'Unsupported File Format'
  },
  provideCsvOrInstackenvJson: {
    id: 'RegisterNodesDialog.provideCsvOrInstackenvJson',
    defaultMessage: 'Please provide a CSV file or instackenv.json.'
  },
  undefinedNode: {
    id: 'RegisterNodesDialog.undefinedNode',
    defaultMessage: 'Undefined Node'
  },
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
  uploadFromFile: {
    id: 'RegisterNodesDialog.uploadFromFile',
    defaultMessage: 'Upload From File'
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
    this.state = {
      jsonErrors: []
    };
  }

  onNodeChange(updatedNode) {
    this.props.updateNode(updatedNode);
  }

  addNodesFromInstackenvJSON(fileContents) {
    this.setState({ jsonErrors:  [] });
    try {
      let nodes = JSON.parse(fileContents).nodes;
      nodes.forEach(node => {
        node.uuid = uuid.v4();
        this.addNode(new NodeToRegister(fromJS(node)));
      });
    } catch(e) {
      this.setState({ jsonErrors: [{ title: this.props.intl.formatMessage(messages.invalidJson),
                                     message: e.toString() }] });
    }
  }

  uploadFromFile(event) {
    let file = event.target.files[0];

    let reader = new FileReader();
    reader.onload = (f => {
      return (e => {
        if (file.name.match(/(\.json)$/)) {
          this.addNodesFromInstackenvJSON(e.target.result);
        } else if (file.name.match(/(\.csv)$/)) {
          // TODO(jtomasek): add CSV file support
          // this.addNodesFromCSV(e.target.result);
          this.props.notify({
            title: this.props.intl.formatMessage(messages.csvUnsupported),
            message: this.props.intl.formatMessage(messages.selectedFileUnsupported)
          });
        } else {
          this.props.notify({
            title: this.props.intl.formatMessage(messages.unsupportedFileFormat),
            message: this.props.intl.formatMessage(messages.provideCsvOrInstackenvJson)
          });
        }
      });
    })(file);
    reader.readAsText(file);
    this.refs.regNodesUploadFileForm.reset();
  }

  selectFile() {
    this.refs.regNodesUploadFileInput.click();
  }

  onAddNewClick(e) {
    // Remove error message from a previous failed parsing of instackenv.json
    this.setState({ jsonErrors:  [] });
    e.preventDefault();
    this.addNode();
  }

  addNode(newNode=new NodeToRegister({uuid: uuid.v4()})) {
    this.props.addNode(newNode);
    this.props.selectNode(newNode.uuid);
  }

  removeNode(uuid, e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.removeNode(uuid);
  }

  selectNode(uuid) {
    this.props.selectNode(uuid);
  }

  renderNode(node, index) {
    let nodeName = node.name || node.pm_addr
                   || this.props.intl.formatMessage(messages.undefinedNode);
    let validationIconClasses = ClassNames({
      'pficon': true,
      'pficon-error-circle-o': !node.valid
    });

    return (
      <Tab key={index} isActive={node.uuid === this.props.selectedNodeId}>
        <a className="link" onClick={this.selectNode.bind(this, node.uuid)}>
          <span className={validationIconClasses}/> {nodeName}
          <span className="tab-action fa fa-trash-o"
                onClick={this.removeNode.bind(this, node.uuid)}/>
        </a>
      </Tab>);
  }

  renderNodeTabs() {
    let renderNode = this.renderNode.bind(this);
    return this.props.nodesToRegister.toList().map(function(node, i) {
      return renderNode(node, i);
    });
  }

  renderTabPanes() {
    if (this.props.selectedNodeId) {
      return this.props.nodesToRegister.toList().map((node) => {
        return (
          <TabPane key={node.uuid}
                   isActive={this.props.selectedNodeId === node.uuid}
                   renderOnlyActive>
            <RegisterNodeForm selectedNode={node} onUpdateNode={this.onNodeChange.bind(this)}/>
          </TabPane>
        );
      });
    } else {
      return (
        <BlankSlate iconClass="fa fa-cubes"
                    title={this.props.intl.formatMessage(messages.noNodesToRegister)}>
          <p><FormattedMessage {...messages.addANodeManually}/></p>
        </BlankSlate>
      );
    }
  }

  getErrors() {
    return this.props.registrationErrors.toJS().concat(this.state.jsonErrors);
  }

  render() {
    return (
      <Modal dialogClasses="modal-xl">
        <div className="modal-header">
          <Link to="/nodes"
                type="button"
                className="close">
            <span className="pficon pficon-close"></span>
          </Link>
          <h4 className="modal-title"><FormattedMessage {...messages.registerNodes}/></h4>
        </div>
        <Loader loaded={!this.props.isRegistering}
                size="lg"
                content={this.props.intl.formatMessage(messages.registeringNodes)}
                height={220}>
          <ModalFormErrorList errors={this.getErrors()}/>
          <div className="container-fluid">
            <div className="row row-eq-height">
              <div className="col-sm-4 col-lg-3 sidebar-pf sidebar-pf-left">
                <div className="nav-stacked-actions">
                  <button className="btn btn-default"
                          type="button"
                          onClick={this.onAddNewClick.bind(this)}>
                    <span className="fa fa-plus"/> <FormattedMessage {...messages.addNew}/>
                  </button>
                  &nbsp; <FormattedMessage {...messages.or}/> &nbsp;
                  <button className="btn btn-default"
                          onClick={this.selectFile.bind(this)}
                          type="button">
                    <span className="fa fa-upload"/>
                    <FormattedMessage {...messages.uploadFromFile}/>
                  </button>
                  <form ref="regNodesUploadFileForm">
                    <input style={{display: 'none'}}
                           ref="regNodesUploadFileInput"
                           id="regNodesUploadFileInput"
                           type="file" accept="text/csv,text/json"
                           onChange={this.uploadFromFile.bind(this)}/>
                   </form>
                </div>
                <ul className="nav nav-pills nav-stacked nav-arrows">
                  {this.renderNodeTabs().reverse()}
                </ul>
              </div>
              <div className="col-sm-8 col-lg-9">
                <div className="tab-content">
                  {this.renderTabPanes()}
                </div>
              </div>
            </div>
          </div>
        </Loader>
        <div className="modal-footer">
          <Link to="/nodes"
                onClick={() => this.props.cancelNodesRegistration()}
                type="button"
                className="btn btn-default"><FormattedMessage {...messages.cancel}/></Link>
          <button disabled={!this.props.canSubmit}
                  onClick={() => this.props.registerNodes(this.props.ironicNodes,
                                                          '/nodes')}
                  className="btn btn-primary"
                  type="button">
            <FormattedMessage {...messages.registerNodes}/>
          </button>
        </div>
      </Modal>
    );
  }
}
RegisterNodesDialog.propTypes = {
  addNode: PropTypes.func.isRequired,
  canSubmit: PropTypes.bool.isRequired,
  cancelNodesRegistration: PropTypes.func.isRequired,
  intl: PropTypes.object,
  ironicNodes: ImmutablePropTypes.map.isRequired,
  isRegistering: PropTypes.bool.isRequired,
  nodesToRegister: ImmutablePropTypes.map.isRequired,
  notify: PropTypes.func.isRequired,
  registerNodes: PropTypes.func.isRequired,
  registrationErrors: ImmutablePropTypes.list.isRequired,
  removeNode: PropTypes.func.isRequired,
  selectNode: PropTypes.func.isRequired,
  selectedNodeId: PropTypes.string,
  updateNode: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    canSubmit: allNodesToRegisterAreValid(state) && !state.registerNodes.get('isRegistering'),
    isRegistering: state.registerNodes.get('isRegistering'),
    nodesToRegister: state.registerNodes.get('nodesToRegister'),
    registrationErrors: state.registerNodes.get('registrationErrors'),
    selectedNodeId: state.registerNodes.get('selectedNodeId'),
    ironicNodes: getIronicNodesfromNodesToRegister(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addNode: node => dispatch(RegisterNodesActions.addNode(node)),
    cancelNodesRegistration: () => dispatch(RegisterNodesActions.cancelNodesRegistration()),
    selectNode: nodeId => dispatch(RegisterNodesActions.selectNode(nodeId)),
    registerNodes: (nodes, redirectPath) => {
      dispatch(RegisterNodesActions.startNodesRegistration(nodes, redirectPath));
    },
    removeNode: nodeId => dispatch(RegisterNodesActions.removeNode(nodeId)),
    updateNode: node => dispatch(RegisterNodesActions.updateNode(node)),
    notify: notification => dispatch(NotificationActions.notify(notification))
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(RegisterNodesDialog));
