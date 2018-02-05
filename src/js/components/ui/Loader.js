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
import { ModalBody } from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';

import { Modal } from '../ui/Modals';

/* TODO(jtomasek): simplify this once updated to React 16 as it allows
   components to return array instead of single element */
export const BaseLoader = ({
  loaded,
  originalContent,
  component,
  componentProps,
  children
}) =>
  loaded
    ? React.createElement(component, componentProps, originalContent)
    : children;

BaseLoader.propTypes = {
  children: PropTypes.element.isRequired,
  // Component to wrap children when loaded can be removed with React 16
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
  loaded: PropTypes.bool.isRequired,
  originalContent: PropTypes.node
};
BaseLoader.defaultProps = {
  component: 'div',
  loaded: false
};

const defaultLoaderPropTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  componentProps: PropTypes.object,
  content: PropTypes.node,
  loaded: PropTypes.bool.isRequired
};
const defaultLoaderDefaultProps = {
  loaded: false
};

export const Loader = ({
  children,
  component,
  componentProps,
  content,
  height,
  inverse,
  loaded,
  size,
  ...rest
}) => (
  <BaseLoader
    component={component}
    componentProps={componentProps}
    loaded={loaded}
    originalContent={children}
  >
    <div style={{ marginTop: height / 2, marginBottom: height / 2 }} {...rest}>
      <Spinner size={size} inverse={inverse} />
      <div className="text-center">{content}</div>
    </div>
  </BaseLoader>
);
Loader.propTypes = {
  ...defaultLoaderPropTypes,
  height: PropTypes.number,
  inverse: PropTypes.bool,
  size: PropTypes.string
};
Loader.defaultProps = { ...defaultLoaderDefaultProps, height: 10 };

export const InlineLoader = ({
  children,
  className,
  component,
  componentProps,
  content,
  loaded,
  size,
  ...rest
}) => (
  <BaseLoader
    component={component}
    componentProps={componentProps}
    loaded={loaded}
    originalContent={children}
  >
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
InlineLoader.propTypes = {
  ...defaultLoaderPropTypes,
  size: PropTypes.string
};
InlineLoader.defaultProps = {
  ...defaultLoaderDefaultProps,
  size: 'xs',
  component: 'span'
};

export const GlobalLoader = ({
  children,
  className,
  component,
  componentProps,
  content,
  loaded,
  ...rest
}) => (
  <BaseLoader
    component={component}
    componentProps={componentProps}
    loaded={loaded}
    originalContent={children}
  >
    <Modal bsSize="sm" show animation={false}>
      <ModalBody>
        <Spinner />
        {content && <div className="text-center">{content}</div>}
      </ModalBody>
    </Modal>
  </BaseLoader>
);
GlobalLoader.propTypes = defaultLoaderPropTypes;
GlobalLoader.defaultProps = defaultLoaderDefaultProps;

export const OverlayLoader = ({
  children,
  className,
  component,
  containerClassName,
  content,
  loaded,
  ...rest
}) => (
  <div className={containerClassName} style={{ position: 'relative' }}>
    {children}
    {!loaded && (
      <div
        className={cx('overlay-loader', className)}
        onClick={e => e.stopPropagation()}
        {...rest}
      >
        <Spinner />
        {content && <div className="text-center">{content}</div>}
      </div>
    )}
    <div className="clearfix" />
  </div>
);
OverlayLoader.propTypes = {
  ...defaultLoaderPropTypes,
  containerClassName: PropTypes.string
};
OverlayLoader.defaultProps = defaultLoaderDefaultProps;

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
