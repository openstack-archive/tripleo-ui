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

import { Modal } from 'react-overlays';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * ModalManagerProvider component provides single ModalManager instance via context to Modal and
 * ModalPanel instances. ModalManager is then aware of all modals and allows for correct modal
 * nesting, focus transfer etc.
 */
class ModalManagerProvider extends React.Component {
  getChildContext() {
    return {
      modalManager: new Modal.Manager()
    };
  }
  render() {
    return this.props.children;
  }
}
ModalManagerProvider.childContextTypes = {
  modalManager: PropTypes.object
};
ModalManagerProvider.propTypes = {
  children: PropTypes.node
};

export default ModalManagerProvider;
