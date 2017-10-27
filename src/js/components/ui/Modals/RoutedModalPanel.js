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

import { connect } from 'react-redux';
import cx from 'classnames';
import { pick } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router-dom';

import ModalPanel from './ModalPanel';

export class RoutedModalPanel extends React.Component {
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
    const modalPanelProps = pick(this.props, Object.keys(ModalPanel.propTypes));
    return (
      <ModalPanel
        {...modalPanelProps}
        // TODO(jtomasek): consider moving this prop directly to ModalPanel once
        // we move all forms from Formsy to Redux-Form
        modalPanelClassName={cx('col-xs-12', 'col-sm-11', 'col-sm-offset-1', {
          'col-lg-8': this.props.showValidations
        })}
        show={this.state.show}
        onHide={this.handleHide.bind(this)}
        onExited={this.handleExited.bind(this)}
      />
    );
  }
}
RoutedModalPanel.propTypes = {
  children: PropTypes.node,
  history: PropTypes.object.isRequired,
  onExited: PropTypes.func,
  onHide: PropTypes.func,
  redirectPath: PropTypes.string,
  showValidations: PropTypes.bool.isRequired
};
RoutedModalPanel.defaultProps = {
  redirectPath: '/'
};
export default connect(state => ({
  showValidations: state.validations.showValidations
}))(withRouter(RoutedModalPanel));
