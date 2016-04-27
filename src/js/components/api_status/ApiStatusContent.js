import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import ApiStatusConstants from '../../constants/ApiStatusConstants';

// NOTE: These components are ugly and just here to show how the API status records can be used.

class ApiStatusItem extends React.Component {
  render() {
    if(!this.props.data) {
      return null;
    }
    let connectionError = this.props.data.status === 0;
    return (
      <li className={this.props.data.success ? 'success' : 'danger'}>
        <p>{this.props.name}</p>
        <p>Loading: {this.props.data.isLoading ? 'Yes' : 'No'}</p>
        <p>Success: {this.props.data.success ? 'Yes' : 'No'}</p>
        <p>Status: {this.props.data.status}</p>
        <p>{this.props.data.statusText}</p>
        <p>Got a connection: {connectionError ? 'No (CORS, API down or no host)' : 'Yes'}</p>
      </li>
    );
  }
}

ApiStatusItem.propTypes = {
  data: ImmutablePropTypes.record,
  name: React.PropTypes.string.isRequired
};

const ApiStatusContent = props => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <h1>API Status</h1>
          <ul>
            <ApiStatusItem name="Keystone API" data={props.items.get(ApiStatusConstants.KEYSTONE)}/>
            <ApiStatusItem name="TripleO API" data={props.items.get(ApiStatusConstants.TRIPLEO)}/>
            <ApiStatusItem name="Ironic API" data={props.items.get(ApiStatusConstants.IRONIC)}/>
            <ApiStatusItem name="Validations API"
                           data={props.items.get(ApiStatusConstants.VALIDATIONS)}/>
            <ApiStatusItem name="Heat API" data={props.items.get(ApiStatusConstants.HEAT)}/>
          </ul>
        </div>
      </div>
    </div>
  );
};

ApiStatusContent.propTypes = {
  items: ImmutablePropTypes.map.isRequired
};

export default ApiStatusContent;
