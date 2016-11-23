import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { List } from 'immutable';
import React from 'react';

import { getRoleServices } from '../../selectors/parameters';
import { getRole } from '../../selectors/roles';
import ParameterInputList from '../parameters/ParameterInputList';
import Tab from '../ui/Tab';

class RoleServices extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedService: undefined
    };
  }

  selectService(serviceName) {
    this.setState({
      selectedService: serviceName
    });
  }

  renderServiceTabs() {
    return this.props.services.toList().map(service => {
      return (
        <Tab key={service.type}
             title={service.description}
             isActive={service.id === this.state.selectedService}>
          <a className="link"
             onClick={this.selectService.bind(this, service.id)}>
            {service.type.split('::').pop()}
          </a>
        </Tab>
      );
    });
  }

  render() {
    return (
      <div className="row-eq-height">
        <div className="col-sm-4 sidebar-pf sidebar-pf-left">
          <ul className="nav nav-pills nav-stacked nav-arrows">
            {this.renderServiceTabs()}
          </ul>
        </div>
        <div className="col-sm-8">
          <ParameterInputList
            emptyParametersMessage={this.state.selectedService ?
                                    'There are currently no parameters to configure in this section'
                                    : 'Please select service to configure'}
            parameters={this.props.services.getIn([this.state.selectedService, 'parameters'],
                                                  List()).toArray()}
            mistralParameters={this.props.mistralParameters}/>
        </div>
      </div>
    );
  }
}
RoleServices.propTypes = {
  mistralParameters: ImmutablePropTypes.map.isRequired,
  params: React.PropTypes.object.isRequired,
  role: ImmutablePropTypes.record.isRequired,
  services: ImmutablePropTypes.map.isRequired
};

function mapStateToProps(state, props) {
  return {
    mistralParameters: state.parameters.mistralParameters,
    role: getRole(state, props.params.roleIdentifier),
    services: getRoleServices(state, props.params.roleIdentifier)
  };
}

export default connect(mapStateToProps)(RoleServices);
