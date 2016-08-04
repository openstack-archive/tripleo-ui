import React from 'react';

import ResourceGroupList from './ResourceGroupList';
import ResourceGroupTab from './ResourceGroupTab';
import ParametersTabPane from './ParametersTabPane';

export default class ParameterTree extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: 'General'
    };
  }

  activateTab(tabName) {
    this.setState({ activeTab: tabName });
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row row-eq-height">
          <div className="col-sm-4 sidebar-pf sidebar-pf-left">
            <div className="treeview">
              <ul className="list-group">
                <ResourceGroupTab key="general"
                                  name="General"
                                  description="General Parameters"
                                  level={0}
                                  activateTab={this.activateTab.bind(this)}
                                  activeTab={this.state.activeTab}/>
                {/*<ResourceGroupTab key="roles"
                                  name="General Parameters"
                                  description=""
                                  level={0}
                                  nestedGroups={this.props.parameterTree.get(
                                    'NestedParameters').toJS()}
                                  activateTab={this.activateTab.bind(this)}
                                  activeTab={this.state.activeTab}/>*/}
                {/*{this.props.parameterTree.get('roles') ? (
                  <ResourceGroupList level={0}
                                     nestedGroups={this.props.parameterTree.get('roles')}
                                     expanded
                                     activeTab={this.state.activeTab}
                                     activateTab={this.activateTab}/>
                ) : null}*/}
              </ul>
            </div>
          </div>
          <div className="col-sm-8">
            <ParametersTabPane name="General"
                               activeTab={this.state.activeTab}
                              // nestedParameters={this.props.parameters.get(
                              //  'NestedParameters').toJS()}
                               parameters={this.props.parameterTree.get('general').toJS()}/>
          </div>
        </div>
      </div>
    );
  }
}
ParameterTree.propTypes = {
  parameterTree: React.PropTypes.object
};
