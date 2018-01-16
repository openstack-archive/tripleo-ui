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

import { defineMessages, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { ListViewIcon, ListViewItem, ListViewInfoItem } from 'patternfly-react';

import { formatBytes } from '../../utils';

const messages = defineMessages({
  type: {
    id: 'NodeDrive.type',
    defaultMessage: 'Type:'
  },
  size: {
    id: 'NodeDrive.size',
    defaultMessage: 'Size:'
  },
  model: {
    id: 'NodeDrive.model',
    defaultMessage: 'Model:'
  },
  serial: {
    id: 'NodeDrive.serial',
    defaultMessage: 'Serial:'
  },
  vendor: {
    id: 'NodeDrive.vendor',
    defaultMessage: 'Vendor:'
  },
  wwn: {
    id: 'NodeDrive.wwn',
    defaultMessage: 'WWN:'
  },
  wwnVendorExtension: {
    id: 'NodeDrive.wwnVendorExtension',
    defaultMessage: 'WWN Vendor Extension:'
  },
  wwnWithExtension: {
    id: 'NodeDrive.wwnWithExtension',
    defaultMessage: 'WWN with Extension:'
  },
  rootDisk: {
    id: 'NodeDrive.rootDisk',
    defaultMessage: 'Root Device'
  },
  na: {
    id: 'NodeDrive.notAvailable',
    defaultMessage: 'n/a'
  }
});

const NodeDrive = ({ drive }) => {
  const [driveSize, driveSizeUnit] = formatBytes(drive.size);
  return (
    <ListViewItem
      leftContent={<ListViewIcon size="sm" icon="pficon pficon-volume" />}
      heading={drive.name}
      description={
        drive.rootDisk && <FormattedMessage {...messages.rootDisk} />
      }
      additionalInfo={[
        <ListViewInfoItem key="driveType">
          <FormattedMessage {...messages.type} />&nbsp;
          <strong>{drive.rotational ? 'HDD' : 'SSD'}</strong>
        </ListViewInfoItem>,
        <ListViewInfoItem key="driveSize">
          <FormattedMessage {...messages.size} />&nbsp;
          <strong>{driveSize}</strong>
          {driveSizeUnit}
        </ListViewInfoItem>
      ]}
    >
      <Row>
        <Col sm={11}>
          <dl className="dl-horizontal">
            <dt>
              <FormattedMessage {...messages.model} />
            </dt>
            <dd>{drive.model || <FormattedMessage {...messages.na} />}</dd>
            <dt>
              <FormattedMessage {...messages.serial} />
            </dt>
            <dd>{drive.serial || <FormattedMessage {...messages.na} />}</dd>
            <dt>
              <FormattedMessage {...messages.vendor} />
            </dt>
            <dd>{drive.vendor || <FormattedMessage {...messages.na} />}</dd>
            <dt>
              <FormattedMessage {...messages.wwn} />
            </dt>
            <dd>{drive.wwn || <FormattedMessage {...messages.na} />}</dd>
            <dt>
              <FormattedMessage {...messages.wwnVendorExtension} />
            </dt>
            <dd>
              {drive.wwn_vendor_extension || (
                <FormattedMessage {...messages.na} />
              )}
            </dd>
            <dt>
              <FormattedMessage {...messages.wwnWithExtension} />
            </dt>
            <dd>
              {drive.wwn_with_extension || (
                <FormattedMessage {...messages.na} />
              )}
            </dd>
          </dl>
        </Col>
      </Row>
    </ListViewItem>
  );
};
NodeDrive.propTypes = {
  drive: PropTypes.object.isRequired
};

export default NodeDrive;
