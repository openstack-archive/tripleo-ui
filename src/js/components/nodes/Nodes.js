import { connect } from 'react-redux';
import { Link } from 'react-router';
import React from 'react';
import { Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import NavTab from '../ui/NavTab';
import NodesActions from '../../actions/NodesActions';
import RolesActions from '../../actions/RolesActions';
import { getRegisteredNodes,
         getDeployedNodes,
         getMaintenanceNodes } from '../../selectors/nodes';

class Nodes extends React.Component {
  componentDidMount() {
    this.props.dispatch(NodesActions.fetchNodes());
    this.props.dispatch(RolesActions.fetchRoles());
  }

  refreshResults(e) {
    e.preventDefault();
    this.props.dispatch(NodesActions.fetchNodes());
    this.props.dispatch(RolesActions.fetchRoles());
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="page-header">
            <div className="pull-right">
              <a href="" onClick={this.refreshResults.bind(this)}>
                <span className="pficon pficon-refresh"></span> Refresh Results
              </a>
              &nbsp;
              <Link to="/nodes/registered/register"
                    className="btn btn-primary">
                <span className="fa fa-plus"/> Register Nodes
              </Link>
            </div>
            <h1>Nodes</h1>
          </div>
          <ul className="nav nav-tabs">
            <NavTab to="/nodes/registered">
              Registered<span className="badge">{this.props.nodes.get('registered').size}</span>
            </NavTab>
            <NavTab to="/nodes/deployed">
              Deployed<span className="badge">{this.props.nodes.get('deployed').size}</span>
            </NavTab>
            <NavTab to="/nodes/maintenance">
              Maintenance<span className="badge">{this.props.nodes.get('maintenance').size}</span>
            </NavTab>
          </ul>
          <div className="tab-pane">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
Nodes.propTypes = {
  children: React.PropTypes.node.isRequired,
  dispatch: React.PropTypes.func.isRequired,
  nodes: ImmutablePropTypes.map.isRequired
};

function mapStateToProps(state) {
  return {
    nodes: state.nodes.merge(
      Map({
        registered: getRegisteredNodes(state),
        deployed: getDeployedNodes(state),
        maintenance: getMaintenanceNodes(state)
      })
    )
  };
}

export default connect(mapStateToProps)(Nodes);
