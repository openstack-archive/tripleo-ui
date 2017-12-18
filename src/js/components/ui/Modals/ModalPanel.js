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
import { Modal } from 'react-overlays';
import PropTypes from 'prop-types';
import React from 'react';
// import { Fade } from 'react-bootstrap';

// TODO(jtomasek): use Fade transition from react-bootstrap once it is updated
// to work correctly
import Transition, {
  ENTERED,
  ENTERING
} from 'react-transition-group/Transition';

const Fade = ({ children, ...props }) => {
  const fadeStyles = {
    [ENTERING]: 'in',
    [ENTERED]: 'in'
  };

  return (
    <Transition {...props} timeout={400}>
      {(status, innerProps) =>
        React.cloneElement(children, {
          ...innerProps,
          className: `fade ${fadeStyles[status]} ${children.props.className}`
        })
      }
    </Transition>
  );
};
Fade.propTypes = {
  children: PropTypes.node
};

class ModalPanel extends React.Component {
  // provide onHide via context, so child buttons (close/cancel) can access it
  // see https://github.com/react-bootstrap/react-bootstrap/blob/master/src/Modal.js#L152
  getChildContext() {
    return {
      $bs_modal: {
        onHide: this.props.onHide
      }
    };
  }

  render() {
    const { children, modalPanelClassName, style, ...props } = this.props;

    return (
      <Modal
        backdropClassName="modal-panel-backdrop modal-backdrop"
        backdropStyle={style}
        containerClassName="modal-open"
        backdropTransition={Fade}
        transition={Fade}
        className="fixed-container"
        style={style}
        {...props}
      >
        <div className="container-fluid modal-panel-wrapper">
          <div className="row">
            <div
              className={cx('modal-panel', modalPanelClassName)}
              style={style}
            >
              <div className="row flex-container">{children}</div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}
ModalPanel.childContextTypes = {
  $bs_modal: PropTypes.shape({
    onHide: PropTypes.func
  })
};
ModalPanel.propTypes = {
  ...Modal.propTypes,
  children: PropTypes.node,
  modalPanelClassName: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired
};
ModalPanel.defaultProps = {
  ...Modal.defaultProps,
  modalPanelClassName: 'col-xs-12 col-sm-11 col-sm-offset-1',
  style: { top: 86 }
};

export default ModalPanel;
