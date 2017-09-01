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
import { defineMessages, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';

import Tab from '../../ui/Tab';

const messages = defineMessages({
  undefinedNode: {
    id: 'RegisterNodesDialog.undefinedNode',
    defaultMessage: 'Undefined Node'
  }
});

const NodeTab = ({
  intl: { formatMessage },
  invalid,
  isActive,
  node,
  selectNode,
  removeNode
}) => (
  <Tab isActive={isActive}>
    <a className="link" onClick={selectNode}>
      <span className={cx('pficon', { 'pficon-error-circle-o': invalid })} />
      {' '}
      {node.name ||
        (node.pm_addr &&
          node.pm_addr + (node.pm_port ? `:${node.pm_port}` : '')) ||
        formatMessage(messages.undefinedNode)}
      <span className="tab-action fa fa-trash-o" onClick={removeNode} />
    </a>
  </Tab>
);
NodeTab.propTypes = {
  intl: PropTypes.object.isRequired,
  invalid: PropTypes.bool.isRequired,
  isActive: PropTypes.bool.isRequired,
  node: PropTypes.object.isRequired,
  removeNode: PropTypes.func.isRequired,
  selectNode: PropTypes.func.isRequired
};
export default injectIntl(NodeTab);
