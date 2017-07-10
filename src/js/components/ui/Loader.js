/**
 * Copyright 2017 Red Hat Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Modal from '../ui/Modal';

export default class Loader extends React.Component {
  renderGlobalLoader(classes) {
    return (
      <div className={this.props.className}>
        <Modal dialogClasses="modal-sm">
          <div className="modal-body loader">
            <div className={classes} />
            <div className="text-center">{this.props.content}</div>
          </div>
        </Modal>
      </div>
    );
  }

  renderInlineLoader(classes) {
    return (
      <span className={this.props.className}>
        <span className={classes} />
        {this.props.content}
      </span>
    );
  }

  renderOverlayLoader(classes) {
    return (
      <div
        style={{
          paddingTop: `${this.props.height / 2}px`,
          paddingBottom: `${this.props.height / 2}px`
        }}
        className="overlay-loader"
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <div className={classes} />
        <div className="text-center">{this.props.content}</div>
      </div>
    );
  }

  renderDefaultLoader(classes) {
    return (
      <div
        style={{
          marginTop: `${this.props.height / 2}px`,
          marginBottom: `${this.props.height / 2}px`
        }}
        className={this.props.className}
      >
        <div className={classes} />
        <div className="text-center">{this.props.content}</div>
      </div>
    );
  }

  render() {
    let classes = ClassNames({
      spinner: true,
      'spinner-xs': this.props.size === 'xs' ||
        (!this.props.size && this.props.inline),
      'spinner-sm': this.props.size === 'sm',
      'spinner-lg': this.props.size === 'lg',
      'spinner-xl': this.props.size === 'xl',
      'spinner-inline': this.props.inline,
      'spinner-inverse': this.props.inverse
    });

    if (!this.props.loaded) {
      if (this.props.global) {
        return this.renderGlobalLoader(classes);
      } else if (this.props.inline) {
        return this.renderInlineLoader(classes);
      } else if (this.props.overlay) {
        return this.renderOverlayLoader(classes);
      } else {
        return this.renderDefaultLoader(classes);
      }
    }
    return React.createElement(
      this.props.component,
      this.props.componentProps,
      this.props.children
    );
  }
}
Loader.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]),
  className: PropTypes.string,
  component: PropTypes.any, // Component to wrap children when loaded
  componentProps: PropTypes.object,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  global: PropTypes.bool,
  height: PropTypes.number,
  inline: PropTypes.bool,
  inverse: PropTypes.bool,
  loaded: PropTypes.bool,
  overlay: PropTypes.bool.isRequired,
  size: PropTypes.oneOf(['xs', 'sm', 'lg', 'xl'])
};
Loader.defaultProps = {
  component: 'div',
  componentProps: {},
  content: '',
  global: false,
  height: 10,
  inline: false,
  overlay: false
};
