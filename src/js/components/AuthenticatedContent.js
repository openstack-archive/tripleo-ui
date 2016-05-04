import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import { getValidationStages, getValidationsStatusCounts } from '../selectors/validations';
import Loader from './ui/Loader';
import LoginActions from '../actions/LoginActions';

import NavBar from './NavBar';
import NotificationsToaster from './notifications/NotificationsToaster';
import ValidationsActions from '../actions/ValidationsActions';
// import ValidationsIndicator from './validations/ValidationsIndicator';
import ValidationsList from './validations/ValidationsList';

export default class AuthenticatedContent extends React.Component {
  componentDidMount() {
    this.props.fetchValidationStages();
  }

  render() {
    return (
      <div>
        <Loader loaded={!this.props.isAuthenticating}
                content="Authenticating ..."
                global>
          <header>
            <NavBar user={this.props.user}
                    onLogout={this.props.logoutUser.bind(this)}/>
          </header>
          <div className="wrapper-fixed-body container-fluid">
            <div className="row">
              <div className="col-sm-12 col-lg-9">{this.props.children}</div>
              <div className="col-sm-12 col-lg-3 sidebar-pf sidebar-pf-right">
                <div className="sidebar-header
                                sidebar-header-bleed-left
                                sidebar-header-bleed-right">
                  <div className="actions pull-right">
                    <Loader key="rolesLoader"
                            loaded={!(this.props.validationStagesLoaded &&
                                      this.props.isFetchingValidationStages)}
                            content="Loading Validations..."
                            inline>
                      <a className="link refresh"
                         onClick={this.props.fetchValidationStages.bind(this)}>
                        <span className="pficon pficon-refresh"></span> Refresh
                      </a>
                    </Loader>
                  </div>
                  <h2 className="h4">Validations</h2>
                </div>
                <Loader loaded={this.props.validationStagesLoaded}
                        content="Loading Validations..."
                        height={80}>
                  <ValidationsList
                    runValidationStage={this.props.runValidationStage}
                    runValidation={this.props.runValidation}
                    stopValidation={this.props.stopValidation}
                    toggleValidationStageVisibility={this.props.toggleValidationStageVisibility}
                    validationStages={this.props.validationStages}/>
                </Loader>
              </div>
            </div>
          </div>
        </Loader>
        <NotificationsToaster />
      </div>
    );
  }
}
AuthenticatedContent.propTypes = {
  children: React.PropTypes.node,
  dispatch: React.PropTypes.func,
  fetchValidationStages: React.PropTypes.func.isRequired,
  isAuthenticating: React.PropTypes.bool.isRequired,
  isFetchingValidationStages: React.PropTypes.bool.isRequired,
  logoutUser: React.PropTypes.func.isRequired,
  runValidation: React.PropTypes.func.isRequired,
  runValidationStage: React.PropTypes.func.isRequired,
  stopValidation: React.PropTypes.func.isRequired,
  toggleValidationStageVisibility: React.PropTypes.func.isRequired,
  user: ImmutablePropTypes.map,
  validationStages: ImmutablePropTypes.map.isRequired,
  validationStagesLoaded: React.PropTypes.bool.isRequired,
  validationsStatusCounts: ImmutablePropTypes.record.isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    fetchValidationStages: () => {
      dispatch(ValidationsActions.fetchValidationStages());
    },
    runValidationStage: (uuid) => {
      dispatch(ValidationsActions.runValidationStage(uuid));
    },
    runValidation: (uuid) => {
      dispatch(ValidationsActions.runValidation(uuid));
    },
    stopValidation: (uuid) => {
      dispatch(ValidationsActions.stopValidation(uuid));
    },
    logoutUser: () => dispatch(LoginActions.logoutUser()),
    toggleValidationStageVisibility: (uuid) => {
      dispatch(ValidationsActions.toggleValidationStageVisibility(uuid));
    }
  };
};

const mapStateToProps = state => {
  return {
    isAuthenticating: state.login.get('isAuthenticating'),
    isFetchingValidationStages: state.validations.get('isFetching'),
    user: state.login.getIn(['keystoneAccess', 'user']),
    validationStages: getValidationStages(state),
    validationStagesLoaded: state.validations.get('loaded'),
    validationsStatusCounts: getValidationsStatusCounts(state)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticatedContent);
