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
    <Motion defaultStyle={{opacity: 0}} style={{opacity: spring(1)}}>
      {interpolatingStyle =>
        <div style={interpolatingStyle}
             className="fixed-container modal-panel-backdrop col-sm-12"></div>}
    </Motion>
  );
};

export class ModalPanel extends React.Component {
  render() {
    return (
      <Motion defaultStyle={{opacity: 0, left: 2000}} style={{opacity: 1, left: spring(0)}}>
        {interpolatingStyle =>
          <div style={interpolatingStyle}
               className="fixed-container col-sm-12 col-md-11 col-md-offset-1 col-lg-8 modal-panel">
            {this.props.children}
          </div>}
      </Motion>
    );
  }
}
ModalPanel.propTypes = {
  children: React.PropTypes.node
};

export const ModalPanelHeader = ({ children }) => {
  return (
    <div className="fixed-container-header row">
      <div className="modal-panel-header col-sm-12">
        {children}
      </div>
    </div>
  );
};
ModalPanelHeader.propTypes = {
  children: React.PropTypes.node
};

export const ModalPanelBody = ({ children }) => {
  return (
    <div className="fixed-container-body row">
      {children}
    </div>
  );
};
ModalPanelBody.propTypes = {
  children: React.PropTypes.node
};

export const ModalPanelFooter = ({ children }) => {
  return (
    <div className="fixed-container-footer row">
      <div className="modal-panel-footer col-sm-12">
        {children}
      </div>
    </div>
  );
};
ModalPanelFooter.propTypes = {
  children: React.PropTypes.node
};
