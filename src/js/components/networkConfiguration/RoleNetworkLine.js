/**
 * Copyright 2018 Red Hat Inc.
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
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React from 'react';

import { getNetworkColorStyle } from './utils';
import { getNetworkResourceExistsByNetwork } from '../../selectors/networks';
import { NetworksHighlightContext } from './NetworksHighlighter';

class RoleNetworkLine extends React.Component {
  render() {
    return (
      <NetworksHighlightContext.Consumer>
        {({ highlightedNetworks, setHighlightedNetworks }) => {
          const {
            className,
            disabled,
            lineRef,
            networkName,
            networkLineHeight
          } = this.props;

          const highlighted = highlightedNetworks.includes(networkName);

          const { backgroundColor, borderColor } = getNetworkColorStyle(
            disabled ? 'disabled' : networkName
          );

          return (
            <li className={cx('role-nic', className)} ref={lineRef}>
              <div
                style={{
                  height: networkLineHeight,
                  bottom: -networkLineHeight,
                  backgroundColor,
                  borderColor
                }}
                className={cx('role-network-line', {
                  highlighted,
                  in: networkLineHeight > 0
                })}
              />
              <div
                className={cx('role-network-point', { highlighted })}
                style={{
                  bottom: -networkLineHeight - 5,
                  opacity: 1,
                  backgroundColor,
                  borderColor
                }}
              />
            </li>
          );
        }}
      </NetworksHighlightContext.Consumer>
    );
  }
}
RoleNetworkLine.propTypes = {
  className: PropTypes.string,
  disabled: PropTypes.bool.isRequired,
  lineRef: PropTypes.func.isRequired,
  networkLineHeight: PropTypes.number.isRequired,
  networkName: PropTypes.string.isRequired
};
RoleNetworkLine.defaultProps = {
  disabled: false,
  networkLineHeight: 0
};

const mapStateToProps = (state, { networkName }) => ({
  disabled: !getNetworkResourceExistsByNetwork(state)
    .set('Provisioning', true)
    .get(networkName)
});

export default connect(mapStateToProps)(RoleNetworkLine);
