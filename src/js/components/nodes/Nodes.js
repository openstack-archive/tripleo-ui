import { connect } from 'react-redux';
import { Link } from 'react-router';
import React from 'react';
import { Map } from 'immutable';
import ImmutablePropTypes from 'react-immutable-proptypes';

import NavTab from '../ui/NavTab';
import NodesActions from '../../actions/NodesActions';
import { getRegisteredNodes,
         getIntrospectedNodes,
         getProvisionedNodes,
         getMaintenanceNodes } from '../../selectors/nodes';

class Nodes extends React.Component {
  componentDidMount() {
    this.props.dispatch(NodesActions.fetchNodes());
  }

  refreshResults(e) {
    e.preventDefault();
    this.props.dispatch(NodesActions.fetchNodes());
  }

  introspectNodes() {
    this.props.dispatch(NodesActions.introspectNodes());
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
            <NavTab to="/nodes/introspected">
              Introspected<span className="badge">{this.props.nodes.get('introspected').size}</span>
            </NavTab>
            <NavTab to="/nodes/provisioned">
              Provisioned<span className="badge">{this.props.nodes.get('provisioned').size}</span>
            </NavTab>
            <NavTab to="/nodes/maintenance">
              Maintenance<span className="badge">{this.props.nodes.get('maintenance').size}</span>
            </NavTab>
          </ul>
          <div className="tab-pane">
            {React.cloneElement(this.props.children,
                                { nodes: this.props.nodes,
                                  introspectNodes: this.introspectNodes.bind(this) })}
          </div>

          <div className="panel panel-info">
            <div className="panel-heading">
              <h3 className="panel-title">
                <span className="pficon pficon-help"></span> Nodes
              </h3>
            </div>
            <div className="panel-body">
              <p>To register Nodes specified in instackenv.json run</p>
              <pre>tripleo.sh --register-nodes</pre>
              <p>To introspect registered Nodes run</p>
              <pre>tripleo.sh --introspect-nodes</pre>
            </div>
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

// Which props do we want to inject, given the global state?
// Note: use https://github.com/faassen/reselect for better performance.
function mapStateToProps(state) {
  return {
    nodes: state.nodes.merge(
      Map({
        registered: getRegisteredNodes(state),
        introspected: getIntrospectedNodes(state),
        provisioned: getProvisionedNodes(state),
        maintenance: getMaintenanceNodes(state)
      })
    )
  };
}

export default connect(mapStateToProps)(Nodes);
