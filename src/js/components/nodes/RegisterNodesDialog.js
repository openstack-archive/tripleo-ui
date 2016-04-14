import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ClassNames from 'classnames';
import { Link } from 'react-router';
import { Map } from 'immutable';
import React from 'react';

import BlankSlate from '../ui/BlankSlate';
import { allNodesToRegisterAreValid } from '../../selectors/registerNodes';
import { NodeToRegister } from '../../immutableRecords/nodes';
import NotificationActions from '../../actions/NotificationActions';
import RegisterNodesActions from '../../actions/RegisterNodesActions';
import RegisterNodeForm from './RegisterNodeForm';
import Tab from '../ui/Tab';
import TabPane from '../ui/TabPane';

class RegisterNodesDialog extends React.Component {
  onNodeChange(updatedNode) {
    this.props.dispatch(RegisterNodesActions.updateNode(updatedNode));
  }

  addNodesFromInstackenvJSON(fileContents) {
    let nodes = JSON.parse(fileContents).nodes;
    nodes.forEach(node => {
      switch(node.pm_type) {
      case 'pxe_ssh':
        this.addNode(new NodeToRegister({
          id: Date.now(),
          driver: node.pm_type,
          nicMacAddress: node.mac.toString(),
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
          this.props.dispatch(NotificationActions.notify({
            title: 'CSV Upload Unsupported',
            message: 'The selected file format is not supported yet'
          }));
        } else {
          this.props.dispatch(NotificationActions.notify({
            title: 'Unsuported File Format',
            message: 'Please provide csv file or instackenv.json'
          }));
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

  addNode(newNode=new NodeToRegister({id: Date.now()})) {
    this.props.dispatch(RegisterNodesActions.addNode(newNode));
    this.props.dispatch(RegisterNodesActions.selectNode(newNode.id));
  }

  removeNode(id, e) {
    e.preventDefault();
    e.stopPropagation();
    this.props.dispatch(RegisterNodesActions.removeNode(id));
  }

  selectNode(id) {
    this.props.dispatch(RegisterNodesActions.selectNode(id));
  }

  renderNode(node, index) {
    // TODO(jtomasek): fix the name setting here
    let nodeName = node.driver_info.get('ssh_address') ||
                   node.driver_info.get('ipmi_address') ||
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
      <div>
        <div className="modal modal-routed in" role="dialog">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <Link to="/nodes/registered"
                      type="button"
                      className="close">
                  <span className="pficon pficon-close"></span>
                </Link>
                <h4 className="modal-title">Register Nodes</h4>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-xs-5">
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
                  <div className="col-xs-7">
                    <div className="tab-content">
                      {this.renderTabPanes()}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Link to="/nodes/registered"
                      type="button"
                      className="btn btn-default">Cancel</Link>
                <button disabled={!this.props.canSubmit}
                        className="btn btn-primary"
                        type="submit">
                  Register Nodes
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal-backdrop in"></div>
      </div>
    );
  }
}
RegisterNodesDialog.propTypes = {
  canSubmit: React.PropTypes.bool.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  nodesToRegister: ImmutablePropTypes.map.isRequired,
  selectedNodeId: React.PropTypes.number
};

function mapStateToProps(state) {
  return {
    canSubmit: allNodesToRegisterAreValid(state),
    nodesToRegister: state.registerNodes.get('nodesToRegister'),
    selectedNodeId: state.registerNodes.get('selectedNodeId')
  };
}

export default connect(mapStateToProps)(RegisterNodesDialog);
