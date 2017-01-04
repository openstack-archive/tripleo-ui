import { connect } from 'react-redux';
import { defineMessages, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Map } from 'immutable';
import React from 'react';

import ParameterInputList from '../parameters/ParameterInputList';
import { getRoleResourceTree } from '../../selectors/parameters';
import { getRole } from '../../selectors/roles';
import Tab from '../ui/Tab';

const messages = defineMessages({
  noParameters: {
    id: 'RoleServices.noParameters',
    defaultMessage: 'There are currently no parameters to configure in this section.'
  },
  selectService: {
    id: 'RoleServices.selectService',
    defaultMessage: 'Please select service to configure.'
  }
});

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
    const services = this.props.roleResourceTree.get('services', Map());
    return services.toList().map(service => {
      return (
        <Tab key={service.get('name')}
             title={service.get('description')}
             isActive={service.get('name') === this.state.selectedService}>
          <a className="link"
             onClick={this.selectService.bind(this, service.get('name'))}>
            {service.get('name')}
          </a>
        </Tab>
      );
    });
  }

  render() {
    const { formatMessage } = this.props.intl;
    return (
      <div className="row-eq-height">
        <div className="col-sm-4 sidebar-pf sidebar-pf-left">
          <ul className="nav nav-pills nav-stacked nav-arrows">
            {this.renderServiceTabs()}
          </ul>
        </div>
        <div className="col-sm-8">
          <ParameterInputList
            emptyParametersMessage={this.state.selectedService
                                    ? formatMessage(messages.noParameters)
                                    : formatMessage(messages.selectService)}
            parameters={this.props.roleResourceTree.getIn(['services',
                                                           this.state.selectedService,
                                                           'parameters'], Map())}
            mistralParameters={this.props.mistralParameters}/>
        </div>
      </div>
    );
  }
}
RoleServices.propTypes = {
  intl: React.PropTypes.object,
  mistralParameters: ImmutablePropTypes.map.isRequired,
  params: React.PropTypes.object.isRequired,
  role: ImmutablePropTypes.record.isRequired,
  roleResourceTree: ImmutablePropTypes.map
};

function mapStateToProps(state, props) {
  return {
    mistralParameters: state.parameters.mistralParameters,
    roleResourceTree: getRoleResourceTree(state, props.params.roleIdentifier),
    role: getRole(state, props.params.roleIdentifier)
  };
}

export default connect(mapStateToProps)(injectIntl(RoleServices));
