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

import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import Modal from '../ui/Modal';

// export default class Loader extends React.Component {
//   renderGlobalLoader(classes) {
//     return (
//       // <div className={this.props.className}>
//       (
//         <Modal dialogClasses="modal-sm">
//           <div className="modal-body loader">
//             <div className={classes} />
//             <div className="text-center">{this.props.content}</div>
//           </div>
//         </Modal>
//       )
//       // </div>
//     );
//   }
//
//   renderInlineLoader(classes) {
//     return (
//       <span className={this.props.className}>
//         <span className={classes} />
//         {this.props.content}
//       </span>
//     );
//   }
//
//   renderOverlayLoader(classes) {
//     return (
//       <div
//         style={{
//           paddingTop: `${this.props.height / 2}px`,
//           paddingBottom: `${this.props.height / 2}px`
//         }}
//         className="overlay-loader"
//         onClick={e => {
//           e.stopPropagation();
//         }}
//       >
//         <div className={classes} />
//         <div className="text-center">{this.props.content}</div>
//       </div>
//     );
//   }
//
//   renderDefaultLoader(classes) {
//     return (
//       <div
//         style={{
//           marginTop: `${this.props.height / 2}px`,
//           marginBottom: `${this.props.height / 2}px`
//         }}
//         className={this.props.className}
//       >
//         <div className={classes} />
//         <div className="text-center">{this.props.content}</div>
//       </div>
//     );
//   }
//
//   render() {
//     let classes = cx({
//       spinner: true,
//       'spinner-xs': this.props.size === 'xs' ||
//         (!this.props.size && this.props.inline),
//       'spinner-sm': this.props.size === 'sm',
//       'spinner-lg': this.props.size === 'lg',
//       'spinner-xl': this.props.size === 'xl',
//       'spinner-inline': this.props.inline,
//       'spinner-inverse': this.props.inverse
//     });
//
//     if (!this.props.loaded) {
//       if (this.props.global) {
//         return this.renderGlobalLoader(classes);
//       } else if (this.props.inline) {
//         return this.renderInlineLoader(classes);
//       } else if (this.props.overlay) {
//         return this.renderOverlayLoader(classes);
//       } else {
//         return this.renderDefaultLoader(classes);
//       }
//     }
//     return React.createElement(this.props.component, {}, this.props.children);
//   }
// }
// Loader.propTypes = {
//   children: PropTypes.oneOfType([
//     PropTypes.arrayOf(PropTypes.node),
//     PropTypes.node
//   ]),
//   className: PropTypes.string,
//   component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired, // Component to wrap children when loaded
//   content: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
//   global: PropTypes.bool,
//   height: PropTypes.number,
//   inline: PropTypes.bool,
//   inverse: PropTypes.bool,
//   loaded: PropTypes.bool,
//   overlay: PropTypes.bool.isRequired,
//   size: PropTypes.oneOf(['xs', 'sm', 'lg', 'xl'])
// };
// Loader.defaultProps = {
//   component: 'div',
//   content: '',
//   global: false,
//   height: 10,
//   inline: false,
//   overlay: false
// };

/* TODO(jtomasek): simplify this once updated to React 16 as it allows
   components to return array instead of single element */
export const BaseLoader = ({ loaded, originalContent, component, children }) =>
  loaded ? React.createElement(component, {}, originalContent) : children;
BaseLoader.propTypes = {
  children: PropTypes.element.isRequired,
  // Component to wrap children when loaded can be removed with React 16
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  loaded: PropTypes.bool,
  originalContent: PropTypes.node
};
BaseLoader.defaultProps = {
  component: 'div'
};

const defaultLoaderPropTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  content: PropTypes.node,
  loaded: PropTypes.bool.isRequired
};

export const Loader = ({
  children,
  component,
  content,
  height,
  inverse,
  loaded,
  size,
  ...rest
}) => (
  <BaseLoader component={component} loaded={loaded} originalContent={children}>
    <div style={{ marginTop: height / 2, marginBottom: height / 2 }} {...rest}>
      <Spinner size={size} inverse={inverse} />
      <div className="text-center">{content}</div>
    </div>
  </BaseLoader>
);
Loader.propTypes = Object.assign(defaultLoaderPropTypes, {
  height: PropTypes.number,
  inverse: PropTypes.bool,
  size: PropTypes.string
});
Loader.defaultProps = { height: 10 };

export const InlineLoader = ({
  children,
  className,
  component,
  content,
  loaded,
  size,
  ...rest
}) => (
  <BaseLoader component={component} loaded={loaded} originalContent={children}>
    <span>
      <Spinner
        className={className}
        component="span"
        size={size}
        inline
        {...rest}
      />
      {content}
    </span>
  </BaseLoader>
);
InlineLoader.propTypes = Object.assign(defaultLoaderPropTypes, {
  size: PropTypes.string
});
InlineLoader.defaultProps = { size: 'xs', component: 'span' };

export const GlobalLoader = ({
  children,
  className,
  component,
  content,
  loaded,
  ...rest
}) => (
  <BaseLoader component={component} loaded={loaded} originalContent={children}>
    <Modal dialogClasses="modal-sm">
      <div className="modal-body">
        <Spinner />
        {content && <div className="text-center">{content}</div>}
      </div>
    </Modal>
  </BaseLoader>
);
GlobalLoader.propTypes = defaultLoaderPropTypes;

export const OverlayLoader = ({
  children,
  className,
  component,
  content,
  loaded,
  ...rest
}) => (
  <BaseLoader component={component} loaded={loaded} originalContent={children}>
    <div style={{ position: 'relative' }}>
      {children}
      <div
        className={cx('overlay-loader', className)}
        onClick={e => e.stopPropagation()}
        {...rest}
      >
        <Spinner />
        {content && <div className="text-center">{content}</div>}
      </div>
      <div className="clearfix" />
    </div>
  </BaseLoader>
);
OverlayLoader.propTypes = defaultLoaderPropTypes;

export const Spinner = ({ className, component, inline, inverse, size }) => {
  const classes = cx(
    'spinner',
    {
      'spinner-xs': size === 'xs',
      'spinner-sm': size === 'sm',
      'spinner-lg': size === 'lg',
      'spinner-xl': size === 'xl',
      'spinner-inline': inline,
      'spinner-inverse': inverse
    },
    className
  );
  return React.createElement(component, { className: classes });
};
Spinner.propTypes = {
  className: PropTypes.string,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  inline: PropTypes.bool,
  inverse: PropTypes.bool,
  size: PropTypes.string
};
Spinner.defaultProps = { component: 'div' };
