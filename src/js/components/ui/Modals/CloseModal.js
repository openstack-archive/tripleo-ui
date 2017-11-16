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

import { Button } from 'patternfly-react';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * CloseModal is a 'mixin' component which provides onHide Modal function
 * if positioned inside Modal or ModalPanel component
 * see https://cdb.reacttraining.com/use-a-render-prop-50de598f11ce
 */
export class CloseModal extends React.Component {
  render() {
    const modal = this.context.$bs_modal;
    return this.props.render(modal && modal.onHide);
  }
}
CloseModal.contextTypes = {
  $bs_modal: PropTypes.shape({
    onHide: PropTypes.func
  })
};
CloseModal.propTypes = {
  render: PropTypes.func.isRequired
};

export const CloseModalButton = ({ children, ...props }) => (
  <CloseModal
    render={onHide => (
      <Button {...props} onClick={onHide}>
        {children}
      </Button>
    )}
  />
);
CloseModalButton.propTypes = Button.propTypes;

export const CloseModalXButton = () => (
  <CloseModal
    render={onHide => (
      <button
        className="close"
        onClick={onHide}
        aria-hidden="true"
        aria-label="Close"
      >
        <span className="pficon pficon-close" />
      </button>
    )}
  />
);
