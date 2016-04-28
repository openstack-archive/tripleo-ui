import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';
import { Map } from 'immutable';

import ApiStatusActions from '../../actions/ApiStatusActions';
import Status from './Status';
import { isLoggedIn } from '../../selectors/login';

class ApiStatus extends React.Component {
  componentDidMount() {
    this.props.checkKeystoneAPI();
    this.props.checkHeatAPI();
    this.props.checkTripleOApi();
    this.props.checkValidationsApi();
    // APIs which are retrieved via keystone's serviceCatalog can only be retrieved when logged in.
    if(this.props.isLoggedIn) {
      this.props.checkIronicAPI();
    }
  }

  render() {
    return <Status items={this.props.items}/>;
  }
}

ApiStatus.propTypes = {
  checkHeatAPI: React.PropTypes.func.isRequired,
  checkIronicAPI: React.PropTypes.func.isRequired,
  checkKeystoneAPI: React.PropTypes.func.isRequired,
  checkTripleOApi: React.PropTypes.func.isRequired,
  checkValidationsApi: React.PropTypes.func.isRequired,
  items: ImmutablePropTypes.map,
  isLoggedIn: React.PropTypes.bool
};

ApiStatus.defaultProps = {
  items: Map()
};

const mapStateToProps = state => {
  return {
    items: state.apiStatus.services,
    isLoggedIn: isLoggedIn(state)
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
