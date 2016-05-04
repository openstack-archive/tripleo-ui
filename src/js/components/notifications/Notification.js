import React from 'react';
import ClassNames from 'classnames';
import Timer from '../utils/Timer';

export default class Notification extends React.Component {
  constructor() {
    super();
    this._notificationTimer = null;
  }

  componentDidMount() {
    this._notificationTimer = new Timer(() => {
      this._hideNotification();
    }, 8000);
  }

  _hideNotification() {
    console.log('begin hide'); //eslint-disable-line no-console
    if (this._notificationTimer) {
      this._notificationTimer.clear();
      this.props.removeNotification();
    }
  }

  _handleMouseEnter() {
    this._notificationTimer.pause();
  }

  _handleMouseLeave() {
    this._notificationTimer.resume();
  }

  render() {
    let classes = ClassNames({
      'toast-pf': true,
      'alert': true,
      'pull-right': true,
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
  removeNotification: React.PropTypes.func,
  title: React.PropTypes.string,
  type: React.PropTypes.string
};

Notification.defaultProps = {
  title: '',
  type: 'error'
};
