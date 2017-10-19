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

import Modal from './Modal';
import { pick } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';

export class RoutedModal extends React.Component {
  constructor() {
    super();
    this.state = { show: true };
  }

  handleHide() {
    const { onHide } = this.props;
    onHide && onHide();
    this.setState({ show: false });
  }

  handleExited() {
    const { onExited, history, redirectPath } = this.props;
    onExited && onExited();
    history.push(redirectPath);
  }

  render() {
    // pass only props which Modal can accept (removing router props etc.)
    const modalProps = pick(this.props, Object.keys(Modal.propTypes));
    return (
      <Modal
        {...modalProps}
        show={this.state.show}
        onHide={this.handleHide.bind(this)}
        onExited={this.handleExited.bind(this)}
      />
    );
  }
}
RoutedModal.propTypes = {
  children: PropTypes.node,
  history: PropTypes.object.isRequired,
  onExited: PropTypes.func,
  onHide: PropTypes.func,
  redirectPath: PropTypes.string
};
RoutedModal.defaultProps = {
  redirectPath: '/'
};
export default withRouter(RoutedModal);
