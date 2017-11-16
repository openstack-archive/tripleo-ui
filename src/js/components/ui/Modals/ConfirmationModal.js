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

import {
  Button,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';

import Modal from './Modal';
import { CloseModalXButton } from './CloseModal';

export default class ConfirmationModal extends React.Component {
  renderTitle() {
    const iconClass = this.props.iconClass;
    if (iconClass) {
      return <span><span className={iconClass} /> {this.props.title}</span>;
    } else {
      return <span>{this.props.title}</span>;
    }
  }

  render() {
    const {
      show,
      onCancel,
      question,
      confirmActionName,
      onConfirm,
      confirmActionTitle,
      title
    } = this.props;
    return (
      <Modal bsSize="sm" show={show} onHide={onCancel}>
        <ModalHeader>
          <CloseModalXButton />
          <ModalTitle>
            {this.renderTitle()}
          </ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p>{question}</p>
        </ModalBody>
        <ModalFooter>
          <Button bsStyle="danger" name={confirmActionName} onClick={onConfirm}>
            {confirmActionTitle || title}
          </Button>
          <Button aria-label="Close" onClick={onCancel}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}
ConfirmationModal.propTypes = {
  confirmActionName: PropTypes.string,
  confirmActionTitle: PropTypes.string,
  iconClass: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  question: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired
};
ConfirmationModal.defaultProps = {
  question: 'Are you sure?'
};
