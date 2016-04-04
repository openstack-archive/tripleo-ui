import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';
import ClassNames from 'classnames';

import { getValidationStages, getValidationsStatusCounts } from '../selectors/validations';
import NotificationActions from '../actions/NotificationActions';
import ValidationsActions from '../actions/ValidationsActions';

import NotificationsIndicator from './notifications/NotificationsIndicator';
import NotificationList       from './notifications/NotificationList';

import ValidationsIndicator from './validations/ValidationsIndicator';
import ValidationsList from './validations/ValidationsList';

export default class Footer extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      listShown: 'notifications'
    };
  }

  componentDidMount() {
    this.props.fetchValidationStages();
  }

  toggleOpen(e) {
    e.preventDefault();
    this.setState({isOpen: !this.state.isOpen});
  }

  showNotifications(e) {
    e.preventDefault();
    this.setState({isOpen: true, listShown: 'notifications'});
  }

  showValidations(e) {
    e.preventDefault();
    this.setState({isOpen: true, listShown: 'validations'});
  }

  renderValidationsRefresh() {
    if(this.state.isOpen && this.state.listShown === 'validations') {
      return (
        <a className="link pull-right refresh"
           onClick={this.props.fetchValidationStages.bind(this)}>
          <span className="pficon pficon-refresh"></span> Refresh Validations
        </a>
      );
    }
  }

  render() {
    let indicatorsClasses = ClassNames({
      'drawer-nav' : true,
      'drawer-collapsed' : !this.state.isOpen
    });

    let toggleClasses = ClassNames({
      'drawer-toggle link' : true,
      'collapsed': !this.state.isOpen
    });

    let contentClasses = ClassNames({
      'drawer-content row' : true,
      'collapsed': !this.state.isOpen
    });

    let notificationTabClasses =  ClassNames({
      hidden: !this.state.isOpen,
      active: this.state.listShown === 'notifications'
    });
    let validationTabClasses =  ClassNames({
      hidden: !this.state.isOpen,
      active: this.state.listShown === 'validations'
    });

    return (
      <div className="wrapper-fixed-footer drawer-container container-fluid">
        <div className="row">
          <a className={toggleClasses} onClick={this.toggleOpen.bind(this)}></a>
          <ul className={indicatorsClasses}>
            <li className={notificationTabClasses}>
              <a className="link" onClick={this.showNotifications.bind(this)}>Notifications</a>
            </li>
            <li className={validationTabClasses}>
              <a className="link" onClick={this.showValidations.bind(this)}>Validations</a>
            </li>
            <li className={this.state.isOpen ? 'hidden' : ''}>
              <NotificationsIndicator notifications={this.props.notifications}
                                      onClick={this.showNotifications.bind(this)}/>
            </li>
            <li className={(this.state.isOpen ? 'hidden' : '') + ' separator'}></li>
            <li className={this.state.isOpen ? 'hidden' : ''}>
              <ValidationsIndicator validationStages={this.props.validationStages}
                                    validationsStatusCounts={this.props.validationsStatusCounts}
                                    onClick={this.showValidations.bind(this)}/>
            </li>
          </ul>
          {this.renderValidationsRefresh()}
        </div>
        <div className={contentClasses}>
          <NotificationList active={this.state.isOpen && this.state.listShown === 'notifications'}
                            notifications={this.props.notifications}
                            notificationsViewed={this.props.notificationsViewed}
                            removeNotification={this.props.removeNotification}/>
          <ValidationsList  active={this.state.isOpen && this.state.listShown === 'validations'}
                            runValidationStage={this.props.runValidationStage}
                            runValidation={this.props.runValidation}
                            stopValidation={this.props.stopValidation}
                            validationStages={this.props.validationStages}/>
        </div>
      </div>
    );
  }
}
Footer.propTypes = {
  dispatch: React.PropTypes.func,
  fetchValidationStages: React.PropTypes.func.isRequired,
  notifications: ImmutablePropTypes.map.isRequired,
  notificationsViewed: React.PropTypes.func.isRequired,
  removeNotification: React.PropTypes.func.isRequired,
  runValidation: React.PropTypes.func.isRequired,
  runValidationStage: React.PropTypes.func.isRequired,
  stopValidation: React.PropTypes.func.isRequired,
  validationStages: ImmutablePropTypes.map.isRequired,
  validationsStatusCounts: ImmutablePropTypes.record.isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    notificationsViewed: () => {
      dispatch(NotificationActions.notificationsViewed());
    },
    removeNotification: id => {
      dispatch(NotificationActions.removeNotification(id));
    },
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
    }
  };
};

const mapStateToProps = state => {
  return {
    notifications: state.notifications.get('all').sortBy(n => n.timestamp),
    validationStages: getValidationStages(state),
    validationsStatusCounts: getValidationsStatusCounts(state)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
