import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';
import { Map } from 'immutable';

import ApiStatusActions from '../../actions/ApiStatusActions';
import ApiStatusContent from './ApiStatusContent';

class ApiStatus extends React.Component {
  componentDidMount() {
    this.props.checkKeystoneAPI();
    this.props.checkTripleOApi();
    this.props.checkValidationsApi();
  }

  render() {
    return <ApiStatusContent items={this.props.items}/>;
  }
}

ApiStatus.propTypes = {
  checkKeystoneAPI: React.PropTypes.func,
  checkTripleOApi: React.PropTypes.func,
  checkValidationsApi: React.PropTypes.func,
  items: ImmutablePropTypes.map
};

ApiStatus.defaultProps = {
  items: Map()
};

const mapStateToProps = state => {
  return {
    items: state.apiStatus.services
  };
};

const mapDispatchToProps = dispatch => {
  return {
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
