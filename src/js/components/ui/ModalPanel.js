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
import { spring, Motion } from 'react-motion';

/**
 * ModalPanel component is a Modal-like component with specific behavior
 * - is fixed to viewport height
 * - body content overflow is maintained using scrollbar
 * - uses .fixed-container css class to achieve its behavior
 * - its children can render in Modal
 *
 * Usage:
 * export default class TestComponent extends React.Component {
 *   render() {
 *     return (
 *       <div>
 *         <ModalPanelBackdrop />
 *         <ModalPanel>
 *           <ModalPanelHeader>
 *             <h2 className="modal-title">Nodes</h2>
 *           </ModalPanelHeader>
 *           <ModalPanelBody>
 *             <div className="col-sm-12">
 *             </div>
 *           </ModalPanelBody>
 *           <ModalPanelFooter>
 *             Submit this
 *           </ModalPanelFooter>
 *         </ModalPanel>
 *       </div>
 *     );
 *   }
 * }
 */

export const ModalPanelBackdrop = () => {
  return (
    <Motion defaultStyle={{ opacity: 0 }} style={{ opacity: spring(1) }}>
      {interpolatingStyle => (
        <div
          style={interpolatingStyle}
          className="fixed-container modal-panel-backdrop col-sm-12"
        />
      )}
    </Motion>
  );
};

export class ModalPanel extends React.Component {
  componentWillMount() {
    document.body.classList.add('modal-panel-open');
  }

  // remove the modal-open class
  componentWillUnmount() {
    document.body.classList.remove('modal-panel-open');
  }

  render() {
    return (
      <Motion
        defaultStyle={{ opacity: 0.4, translateX: 500 }}
        style={{ opacity: spring(1), translateX: spring(0) }}
      >
        {({ opacity, translateX }) => (
          <div
            style={{ opacity, transform: `translateX(${translateX}px)` }}
            className="fixed-container col-sm-12 col-md-11 col-md-offset-1 modal-panel"
          >
            {this.props.children}
          </div>
        )}
      </Motion>
    );
  }
}
ModalPanel.propTypes = {
  children: PropTypes.node
};

export const ModalPanelHeader = ({ children }) => {
  return (
    <div className="row">
      <div className="modal-panel-header col-sm-12">
        {children}
      </div>
    </div>
  );
};
ModalPanelHeader.propTypes = {
  children: PropTypes.node
};

export const ModalPanelBody = ({ children }) => {
  return (
    <div className="fixed-container-body row">
      {children}
    </div>
  );
};
ModalPanelBody.propTypes = {
  children: PropTypes.node
};

export const ModalPanelFooter = ({ children }) => {
  return (
    <div className="row">
      <div className="modal-panel-footer col-sm-12">
        {children}
      </div>
    </div>
  );
};
ModalPanelFooter.propTypes = {
  children: PropTypes.node
};
