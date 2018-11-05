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
import React from 'react';
import PropTypes from 'prop-types';
import { Row, CardGrid } from 'patternfly-react';

export const ActionCard = ({ children, className, onClick, ...rest }) => (
  <div
    className={cx(
      'action-card',
      'card-pf card-pf-view card-pf-view-select card-pf-view-single-select',
      className
    )}
    onClick={onClick}
    {...rest}
  >
    <div className="card-pf-body">
      <p className="text-center">{children}</p>
    </div>
  </div>
);
ActionCard.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func.isRequired
};

export const CardGridFluid = ({ children, className, matchHeight }) => (
  <div className={cx('cards-pf', className)}>
    <CardGrid matchHeight={matchHeight} fluid>
      <Row style={{ marginRight: '-10px', marginLeft: '-10px' }}>
        {children}
      </Row>
    </CardGrid>
  </div>
);
CardGridFluid.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  matchHeight: PropTypes.bool.isRequired
};
