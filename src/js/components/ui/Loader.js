import ClassNames from 'classnames';
import React from 'react';

export default class Loader extends React.Component {
  render() {
    let classes = ClassNames({
      'spinner': true,
      'spinner-xs': this.props.size === 'xs' || !this.props.size && this.props.inline,
      'spinner-sm': this.props.size === 'sm',
      'spinner-lg': this.props.size === 'lg',
      'spinner-inline': this.props.inline,
      'spinner-inverse': this.props.inverse
    });

    if(!this.props.loaded) {
      if(this.props.global) {
        return (
          <div className={this.props.className}>
            <div className="modal modal-routed in" role="loading">
              <div className="modal-dialog modal-sm">
                <div className="modal-content">
                  <div className="modal-body loader">
                    <div className={classes}/>
                    <div className="text-center">{this.props.content}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop in"></div>
          </div>
        );
      } else if(this.props.inline) {
        return (
          <span className={this.props.className}>
            <span className={classes}></span>
            {this.props.content}
          </span>
        );
      } else {
        return (
          <div style={{marginTop: `${this.props.height/2}px`,
                       marginBottom: `${this.props.height/2}px`}}
               className={this.props.className}>
            <div className={classes}/>
            <div className="text-center">{this.props.content}</div>
          </div>
        );
      }
    }
    return React.createElement(this.props.component, {}, this.props.children);
  }
}
Loader.propTypes = {
  children: React.PropTypes.oneOfType([
    React.PropTypes.arrayOf(React.PropTypes.node),
    React.PropTypes.node
  ]),
  className: React.PropTypes.string,
  component: React.PropTypes.any, // Component to wrap children when loaded
  content: React.PropTypes.string,
  global: React.PropTypes.bool,
  height: React.PropTypes.number,
  inline: React.PropTypes.bool,
  inverse: React.PropTypes.bool,
  loaded: React.PropTypes.bool,
  size: React.PropTypes.oneOf(['xs', 'sm', 'lg'])
};
Loader.defaultProps = {
  component: 'div',
  content: '',
  global: false,
  height: 10,
  inline: false
};
