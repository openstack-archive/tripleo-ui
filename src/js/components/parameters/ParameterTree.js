import React from 'react';

import FormErrorList from '../ui/forms/FormErrorList';
import ResourceGroupTab from './ResourceGroupTab';
import ParametersTabPane from './ParametersTabPane';

export default class ParameterTree extends React.Component {
  constructor() {
    super();
    this.state = {
      activeTab: 'RootParameters'
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
                <ResourceGroupTab name="RootParameters"
                                  description={this.props.parameters.get('Description')}
                                  level={0}
                                  nestedParameters={this.props.parameters.get(
                                    'NestedParameters').toJS()}
                                  activateTab={this.activateTab.bind(this)}
                                  activeTab={this.state.activeTab}/>
              </ul>
            </div>
          </div>
          <div className="col-sm-8">
            <FormErrorList errors={this.props.formErrors}/>
            <ParametersTabPane name="RootParameters"
                               activeTab={this.state.activeTab}
                               nestedParameters={this.props.parameters.get(
                                'NestedParameters').toJS()}
                               parameters={this.props.parameters.get('Parameters').toJS()}/>
          </div>
        </div>
      </div>
    );
  }
}
ParameterTree.propTypes = {
  formErrors: React.PropTypes.array,
  parameters: React.PropTypes.object
};

ParameterTree.defaultProps = {
  formErrors: []
};
