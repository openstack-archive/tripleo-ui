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

import { Col, Card, CardTitle, CardBody } from 'patternfly-react';
import cx from 'classnames';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';
import PropTypes from 'prop-types';
import { truncate } from 'lodash';

import AvailableRoleDetailDialog from './AvailableRoleDetailDialog';

const AvailableRoleInput = ({
  className,
  role,
  input: { value, name, onChange },
  style
}) => (
  <Col xs={12} sm={4} lg={3} style={style}>
    <Card
      matchHeight
      accented
      className={cx(
        'card-pf card-pf-view card-pf-view-select card-pf-view-multi-select role-card',
        { active: value },
        role.identifier,
        className
      )}
    >
      <CardTitle>
        <AvailableRoleDetailDialog
          role={role}
          enabled={value}
          toggle={() => onChange(!value)}
        />
      </CardTitle>
      <CardBody>
        {!role.tags.isEmpty() && (
          <h6>
            {role.tags.map(t => (
              <span key={t}>
                <span className="label label-default">{t}</span>{' '}
              </span>
            ))}
          </h6>
        )}
        <p className="card-pf-info">
          {truncate(role.description, { length: 80 })}
        </p>
      </CardBody>
      <div
        className="card-pf-view-checkbox"
        style={{ right: 15, left: 'auto' }}
      >
        <input
          type="checkbox"
          onChange={() => onChange(!value)}
          checked={value}
        />
      </div>
    </Card>
  </Col>
);
AvailableRoleInput.propTypes = {
  className: PropTypes.string,
  input: PropTypes.object.isRequired,
  role: ImmutablePropTypes.record.isRequired,
  style: PropTypes.object
};

export default AvailableRoleInput;
