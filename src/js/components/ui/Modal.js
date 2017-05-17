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

import PropTypes from 'prop-types';
import React from 'react';
import Portal from 'react-portal';

export default class Modal extends React.Component {
  render() {
    return (
      <Portal isOpened={this.props.show}>
        <PortedModal {...this.props} />
      </Portal>
    );
  }
}
Modal.propTypes = {
  show: PropTypes.bool.isRequired
};

Modal.defaultProps = {
  show: true
};

// This component is intended for internal use of Modal Component
// It is used to mount Modal only when it should be shown
class PortedModal extends React.Component {
  // add the modal-open class to the body of the page so scrollbars render properly.
  componentWillMount() {
    document.body.classList.add('modal-open');
  }

  // remove the modal-open class
  componentWillUnmount() {
    document.body.classList.remove('modal-open');
  }

  render() {
    return (
      <div style={{ display: 'block' }}>
        <div className="modal modal-visible" role="dialog">
          <div
            className={`modal-dialog ${this.props.dialogClasses}`}
            id={this.props.id}
          >
            <div className="modal-content">
              {this.props.children}
            </div>
          </div>
        </div>
        <div className="modal-backdrop in" />
      </div>
    );
  }
}
PortedModal.propTypes = {
  children: PropTypes.node,
  dialogClasses: PropTypes.string.isRequired,
  id: PropTypes.string
};

PortedModal.defaultProps = {
  dialogClasses: ''
};
