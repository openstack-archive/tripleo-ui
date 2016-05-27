import React from 'react';
import ClassNames from 'classnames';
import Timer from '../utils/Timer';

export default class Notification extends React.Component {
  constructor() {
    super();
    this._notificationTimer = null;
  }

  componentDidMount() {
    //create a timer for the notification if it's timeoutable
    if (this.props.timeoutable) {
      this._notificationTimer = new Timer(() => {
        this._hideNotification();
      }, 8000);
    }
  }

  componentWillUpdate(nextProps) {
    // For timeoutable Notifications, handle the Timer pausing based on timerPaused prop
    if (this.props.timeoutable) {
      if (this.props.timerPaused === false && nextProps.timerPaused === true) {
        this._notificationTimer.pause();
      } else if (this.props.timerPaused === true && nextProps.timerPaused === false) {
        this._notificationTimer.resume();
      }
    }
  }

  // hide the notification as long as it's timeoutable
  _hideNotification() {
    if (this.props.timeoutable) {
      this._notificationTimer.clear();
      this.props.removeNotification();
    }
  }

  render() {
    let classes = ClassNames({
      'toast-pf alert pull-right': true,
      'alert': true,
      'alert-danger': this.props.type === 'error',
      'alert-warning': this.props.type === 'warning',
      'alert-success': this.props.type === 'success',
      'alert-info': this.props.type === 'info',
      'alert-dismissable': this.props.dismissable
    });
    let iconClass = ClassNames({
      'pficon': true,
      'pficon-ok': this.props.type === 'success',
      'pficon-info': this.props.type === 'info',
      'pficon-warning-triangle-o': this.props.type === 'warning',
      'pficon-error-circle-o': this.props.type === 'error'
    });

    return (
      <div className="clearfix">
        <div className={classes} role="alert">
          <span className={iconClass} aria-hidden="true"></span>
          {this.props.dismissable ?
            <button type="button"
                    className="close"
                    aria-label="Close"
                    onClick={this._hideNotification.bind(this)}>
              <span className="pficon pficon-close" aria-hidden="true"></span>
            </button> : false}
          <strong>{this.props.title}</strong>
          <p>{this.props.message}</p>
        </div>
      </div>
    );
  }
}

Notification.propTypes = {
  dismissable: React.PropTypes.bool.isRequired,
  message: React.PropTypes.string.isRequired,
  removeNotification: React.PropTypes.func,
  timeoutable: React.PropTypes.bool.isRequired,
  timerPaused: React.PropTypes.bool,
  title: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired
};

Notification.defaultProps = {
  title: '',
  type: 'error'
};
