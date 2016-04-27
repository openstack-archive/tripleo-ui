import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';
import { Map } from 'immutable';

import ApiStatusActions from '../../actions/ApiStatusActions';
import ApiStatusContent from './ApiStatusContent';
import { getKeyStoneAccess } from '../../selectors/login';

class ApiStatus extends React.Component {
  componentDidMount() {
    this.props.checkKeystoneAPI();
    this.props.checkHeatAPI();
    this.props.checkTripleOApi();
    this.props.checkValidationsApi();
    if(this.props.keystoneAccess.size > 0) {
      this.props.checkIronicAPI();
    }
  }

  render() {
    return <ApiStatusContent items={this.props.items}/>;
  }
}

ApiStatus.propTypes = {
  checkHeatAPI: React.PropTypes.func.isRequired,
  checkIronicAPI: React.PropTypes.func.isRequired,
  checkKeystoneAPI: React.PropTypes.func.isRequired,
  checkTripleOApi: React.PropTypes.func.isRequired,
  checkValidationsApi: React.PropTypes.func.isRequired,
  items: ImmutablePropTypes.map,
  keystoneAccess: ImmutablePropTypes.map
};

ApiStatus.defaultProps = {
  items: Map()
};

const mapStateToProps = state => {
  return {
    items: state.apiStatus.services,
    keystoneAccess: getKeyStoneAccess(state)
  };
};

const mapDispatchToProps = dispatch => {
  return {
    checkHeatAPI: () => {
      dispatch(ApiStatusActions.fetchHeatApiRoot());
    },
    checkIronicAPI: () => {
      dispatch(ApiStatusActions.fetchIronicApiRoot());
    },
    checkKeystoneAPI: () => {
      dispatch(ApiStatusActions.fetchKeystoneApiRoot());
    },
    checkTripleOApi: () => {
      dispatch(ApiStatusActions.fetchTripleOApiRoot());
    },
    checkValidationsApi: () => {
      dispatch(ApiStatusActions.fetchValidationsApiRoot());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ApiStatus);
