import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ClassNames from 'classnames';
import { Link } from 'react-router';
import { Map, List } from 'immutable';
import React from 'react';
import shortid from 'shortid';

import BlankSlate from '../ui/BlankSlate';
import { allNodesToRegisterAreValid,
         getIronicNodesfromNodesToRegister } from '../../selectors/registerNodes';
import { NodeToRegister } from '../../immutableRecords/nodes';
import Loader from '../ui/Loader';
import NotificationActions from '../../actions/NotificationActions';
import RegisterNodesActions from '../../actions/RegisterNodesActions';
import RegisterNodeForm from './RegisterNodeForm';
import Tab from '../ui/Tab';
import TabPane from '../ui/TabPane';
import Modal from '../ui/Modal';

class RegisterNodesDialog extends React.Component {
  onNodeChange(updatedNode) {
    this.props.updateNode(updatedNode);
  }

  addNodesFromInstackenvJSON(fileContents) {
    let nodes = JSON.parse(fileContents).nodes;
    nodes.forEach(node => {
      switch(node.pm_type) {
      case 'pxe_ssh':
        this.addNode(new NodeToRegister({
          id: shortid.generate(),
          name: node.name,
          driver: node.pm_type,
          nicMacAddresses: List(node.mac),
          driver_info: Map({
            ssh_virt_type: 'virsh',
            ssh_address: node.pm_addr,
            ssh_user: node.pm_user,
            ssh_key_contents: node.pm_password
          })
        }));
        break;
      case 'pxe_ipmitool':
        this.addNode();
        break;
      default:
        break;
      }
    });
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
            title: 'CSV Upload Unsupported',
            message: 'The selected file format is not supported yet'
          });
        } else {
          this.props.notify({
            title: 'Unsuported File Format',
            message: 'Please provide csv file or instackenv.json'
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
    e.preventDefault();
    this.addNode();
  }

  addNode(newNode=new NodeToRegister({id: shortid.generate()})) {
    this.props.addNode(newNode);
    this.props.selectNode(newNode.id);
  }

  removeNode(id, e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.removeNode(id);
  }

  selectNode(id) {
    this.props.selectNode(id);
  }

  renderNode(node, index) {
    // TODO(jtomasek): fix the name setting here
    let nodeName = node.name ||
                   node.driver_info.get('ssh_address') ||
                   'Undefined Node';
    let validationIconClasses = ClassNames({
      'pficon': true,
      'pficon-error-circle-o': !node.valid
    });

    return (
      <Tab key={index} isActive={node.id === this.props.selectedNodeId}>
        <a className="link" onClick={this.selectNode.bind(this, node.id)}>
          <span className={validationIconClasses}/> {nodeName}
          <span className="tab-action fa fa-trash-o" onClick={this.removeNode.bind(this, node.id)}/>
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
          <TabPane key={node.id}
                   isActive={this.props.selectedNodeId === node.id}
                   renderOnlyActive>
            <RegisterNodeForm selectedNode={node} onUpdateNode={this.onNodeChange.bind(this)}/>
          </TabPane>
        );
      });
    } else {
      return (
        <BlankSlate iconClass="fa fa-cubes"
                    title="No Nodes To Register"
                    message="Add a node manually or upload nodes from a file." />
      );
    }
  }

  render() {
    return (
      <Modal dialogClasses="modal-xl">
        <div className="modal-header">
          <Link to="/nodes/registered"
                type="button"
                className="close">
            <span className="pficon pficon-close"></span>
          </Link>
          <h4 className="modal-title">Register Nodes</h4>
        </div>
        <div className="container-fluid">
          <div className="row row-eq-height">
            <div className="col-sm-4 col-lg-3 sidebar-pf sidebar-pf-left">
              <div className="nav-stacked-actions">
                <button className="btn btn-default"
                        type="button"
                        onClick={this.onAddNewClick.bind(this)}>
                  <span className="fa fa-plus"/> Add New
                </button>
                &nbsp; or &nbsp;
                <button className="btn btn-default"
                        onClick={this.selectFile.bind(this)}
                        type="button">
                  <span className="fa fa-upload"/> Upload From File
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
                <Loader loaded={!this.props.isRegistering}
                        size="lg"
                        content="Registering Nodes..."
                        height={220}>
                  {this.renderTabPanes()}
                </Loader>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <Link to="/nodes/registered"
                type="button"
                className="btn btn-default">Cancel</Link>
          <button disabled={!this.props.canSubmit}
                  onClick={() => this.props.registerNodes(this.props.ironicNodes,
                                                          '/nodes/registered')}
                  className="btn btn-primary"
                  type="button">
            Register Nodes
          </button>
        </div>
      </Modal>
    );
  }
}
RegisterNodesDialog.propTypes = {
  addNode: React.PropTypes.func.isRequired,
  canSubmit: React.PropTypes.bool.isRequired,
  ironicNodes: ImmutablePropTypes.map.isRequired,
  isRegistering: React.PropTypes.bool.isRequired,
  nodesToRegister: ImmutablePropTypes.map.isRequired,
  notify: React.PropTypes.func.isRequired,
  registerNodes: React.PropTypes.func.isRequired,
  removeNode: React.PropTypes.func.isRequired,
  selectNode: React.PropTypes.func.isRequired,
  selectedNodeId: React.PropTypes.string,
  updateNode: React.PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    canSubmit: allNodesToRegisterAreValid(state) && !state.registerNodes.get('isRegistering'),
    isRegistering: state.registerNodes.get('isRegistering'),
    nodesToRegister: state.registerNodes.get('nodesToRegister'),
    selectedNodeId: state.registerNodes.get('selectedNodeId'),
    ironicNodes: getIronicNodesfromNodesToRegister(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    addNode: node => dispatch(RegisterNodesActions.addNode(node)),
    selectNode: nodeId => dispatch(RegisterNodesActions.selectNode(nodeId)),
    registerNodes: (nodes, redirectPath) => {
      dispatch(RegisterNodesActions.registerNodes(nodes, redirectPath));
    },
    removeNode: nodeId => dispatch(RegisterNodesActions.removeNode(nodeId)),
    updateNode: node => dispatch(RegisterNodesActions.updateNode(node)),
    notify: notification => dispatch(NotificationActions.notify(notification))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterNodesDialog);
