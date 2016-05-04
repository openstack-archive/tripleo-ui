import React from 'react';
import ClassNames from 'classnames';
import Timer from '../utils/Timer';

export default class Notification extends React.Component {
  constructor() {
    super();
    this._notificationTimer = null;
  }

  componentDidMount() {
    //create a timer for the notification if it's not persistent
    if (!this.props.persistent) {
      this._notificationTimer = new Timer(() => {
        this._hideNotification();
      }, 8000);
    }
  }

  //hide the notification as long as it's not persistent
  _hideNotification() {
    if (this._notificationTimer && !this.props.persistent) {
      this._notificationTimer.clear();
      this.props.removeNotification();
    }
  }

  // handles the mouse hovering over a notification unless it's a persistent notification
  _handleMouseEnter() {
    !this.props.persistent ? this._notificationTimer.pause() : null;
  }

  // handles the mouse leaving the hover over a notification unless it's a persistent notification
  _handleMouseLeave() {
    !this.props.persistent ? this._notificationTimer.resume() : null;
  }

  render() {
    let classes = ClassNames({
      'toast-pf': true,
      'alert': true,
      'pull-right': !this.props.persistent,
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
      <div className={classes}
           role="alert"
           onMouseEnter={this._handleMouseEnter.bind(this)}
           onMouseLeave={this._handleMouseLeave.bind(this)}>
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
    );
  }
}

Notification.propTypes = {
  dismissable: React.PropTypes.bool.isRequired,
  message: React.PropTypes.string.isRequired,
  onMouseEnter: React.PropTypes.func,
  onMouseLeave: React.PropTypes.func,
  persistent: React.PropTypes.bool,
  removeNotification: React.PropTypes.func,
  title: React.PropTypes.string,
  type: React.PropTypes.string
};

Notification.defaultProps = {
  title: '',
  type: 'error',
  persistent: false
};
