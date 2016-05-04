import React from 'react';
import ClassNames from 'classnames';
import Timer from '../utils/Timer';

export default class Notification extends React.Component {
  constructor() {
    super();
    this.state = {
      visible: true,
      isMounted: true,
      removed: false,
      _notificationTimer: null
    };
  }

  componentDidMount() {
    console.log('timer start'); //eslint-disable-line no-console
    let self = this;
    this._notificationTimer = new Timer(function() {
      self._hideNotification.bind(this);
    }, 8000);
  }

  _hideNotification() {
    console.log('timer done'); //eslint-disable-line no-console
    console.log('begin hide'); //eslint-disable-line no-console
    if (this._notificationTimer) {
      this._notificationTimer.clear();

      console.log('clearNotificationTimer'); //eslint-disable-line no-console
    }

    if (this.isMounted) {
      this.setState({
        visible: false,
        removed: true
      });
      console.log('unMounted'); //eslint-disable-line no-console
    }
  }

  _handleMouseEnter() {
    console.log('handle enter'); //eslint-disable-line no-console
    this._notificationTimer.pause.bind(this);
  }

  _handleMouseLeave() {
    console.log('handle leave'); //eslint-disable-line no-console
    this._notificationTimer.resume.bind(this);
  }

  render() {
    let classes = ClassNames({
      'toast-pf': true,
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
      <div className={classes}
           role="alert"
           onMouseEnter={this._handleMouseEnter}
           onMouseLeave={this._handleMouseLeave}>
        <span className={iconClass} aria-hidden="true"></span>
        {this.props.dismissable ?
          <button type="button"
                  className="close"
                  aria-label="Close"
                  onClick={this.props.removeNotification.bind(this)}>
            <span className="pficon pficon-close" aria-hidden="true"></span>
          </button> : false}
        <strong>{this.props.title}</strong>
        <p>{this.props.message}</p>
      </div>
    );
  }
}
Notification.propTypes = {
  _handleMouseEnter: React.PropTypes.func,
  _handleMouseLeave: React.PropTypes.func,
  _hideNotification: React.PropTypes.func,
  dismissable: React.PropTypes.bool,
  message: React.PropTypes.string.isRequired,
  notification: React.PropTypes.object,
  onMouseEnter: React.PropTypes.func,
  onMouseLeave: React.PropTypes.func,
  removeNotification: React.PropTypes.func,
  title: React.PropTypes.string,
  type: React.PropTypes.string
};
Notification.defaultProps = {
  dismissable: false,
  title: '',
  type: 'error'
};
