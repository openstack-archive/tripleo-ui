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

import {
  defineMessages,
  FormattedDate,
  FormattedMessage,
  FormattedTime,
  injectIntl
} from 'react-intl'
import { startCase } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'

const messages = defineMessages({
  macAddresses: {
    id: 'NodeExtendedInfo.macAddresses',
    defaultMessage: 'Mac Addresses:'
  },
  interfaces: {
    id: 'nodeExtendedinfo.interfaces',
    defaultMessage: 'Interfaces:'
  },
  macAddress: {
    id: 'nodeExtendedinfo.interfaceMacAddress',
    defaultMessage: 'MAC Address'
  },
  ipAddress: {
    id: 'nodeExtendedinfo.interfaceIpAddress',
    defaultMessage: 'IP Address'
  },
  bios: {
    id: 'nodeExtendedinfo.bios',
    defaultMessage: 'Bios:'
  },
  rootDisk: {
    id: 'nodeExtendedinfo.rootDisk',
    defaultMessage: 'Root Disk:'
  },
  product: {
    id: 'nodeExtendedinfo.product',
    defaultMessage: 'Product:'
  },
  productName: {
    id: 'nodeExtendedinfo.productName',
    defaultMessage: 'Name'
  },
  productVendor: {
    id: 'nodeExtendedinfo.productVendor',
    defaultMessage: 'Vendor'
  },
  productVersion: {
    id: 'nodeExtendedinfo.productVersion',
    defaultMessage: 'Version'
  },
  kernel: {
    id: 'nodeExtendedinfo.kernel',
    defaultMessage: 'Kernel:'
  },
  uuid: {
    id: 'nodeExtendedinfo.uuid',
    defaultMessage: 'UUID:'
  },
  registered: {
    id: 'nodeExtendedinfo.registered',
    defaultMessage: 'Registered:'
  },
  architecture: {
    id: 'nodeExtendedinfo.architecture',
    defaultMessage: 'Architecture:'
  },
  driver: {
    id: 'nodeExtendedinfo.driver',
    defaultMessage: 'Driver:'
  }
})

class NodeExtendedInfo extends React.Component {
  componentDidMount() {
    if (
      this.props.node.getIn(['introspectionStatus', 'state']) === 'finished'
    ) {
      this.props.fetchNodeIntrospectionData(this.props.node.get('uuid'))
    }
  }

  renderInterfaces() {
    const { intl, node } = this.props
    if (node.getIn(['introspectionData', 'interfaces']).isEmpty()) {
      return (
        <dl>
          <dt><FormattedMessage {...messages.macAddresses} /></dt>
          {node.get('macs').map(mac => <dd key={mac}>{mac}</dd>)}
        </dl>
      )
    } else {
      return (
        <dl>
          <dt><FormattedMessage {...messages.interfaces} /></dt>
          <dd>
            {node
              .getIn(['introspectionData', 'interfaces'])
              .map((ifc, k) => {
                return (
                  <div key={k}>
                    {k}
                    {' '} - {' '}
                    <span title={intl.formatMessage(messages.macAddress)}>
                      {ifc.get('mac')}
                    </span>
                    {' '} | {' '}
                    <span title={intl.formatMessage(messages.ipAddress)}>
                      {ifc.get('ip')}
                    </span>
                    {ifc.get('pxe') && '| PXE'}
                  </div>
                )
              })
              .toList()}
          </dd>
        </dl>
      )
    }
  }

  renderBios() {
    const bios = this.props.node.getIn(['introspectionData', 'bios'])
    return (
      !bios.isEmpty() &&
      <div>
        <dt><FormattedMessage {...messages.bios} /></dt>
        <dd>
          {bios
            .map((i, k) => <span key={k} title={startCase(k)}>{i} </span>)
            .toList()}
        </dd>
      </div>
    )
  }

  renderRootDisk() {
    const rootDisk = this.props.node.getIn(['introspectionData', 'rootDisk'])
    return (
      rootDisk &&
      <div>
        <dt><FormattedMessage {...messages.rootDisk} /></dt>
        <dd>{rootDisk}</dd>
      </div>
    )
  }

  renderProduct() {
    const product = this.props.node.getIn(['introspectionData', 'product'])
    return (
      !product.isEmpty() &&
      <div>
        <dt><FormattedMessage {...messages.product} /></dt>
        <dd>
          <span title={this.props.intl.formatMessage(messages.productName)}>
            {product.get('name')}
          </span>
          {' '} - {' '}
          <span title={this.props.intl.formatMessage(messages.productVendor)}>
            {product.get('vendor')}
          </span>
          {' '} | {' '}
          <span title={this.props.intl.formatMessage(messages.productVersion)}>
            {product.get('version')}
          </span>
        </dd>
      </div>
    )
  }

  renderKernel() {
    const kernelVersion = this.props.node.getIn([
      'introspectionData',
      'kernelVersion'
    ])
    return (
      kernelVersion &&
      <div>
        <dt><FormattedMessage {...messages.kernel} /></dt>
        <dd>{kernelVersion}</dd>
      </div>
    )
  }

  render() {
    const { node } = this.props
    return (
      <Row>
        <Col lg={4} md={6}>
          <dl className="dl-horizontal dl-horizontal-condensed">
            <dt><FormattedMessage {...messages.uuid} /></dt>
            <dd>{node.get('uuid')}</dd>
            <dt><FormattedMessage {...messages.registered} /></dt>
            <dd>
              <FormattedDate value={node.get('created_at')} />
              &nbsp;
              <FormattedTime value={node.get('created_at')} />
            </dd>
            <dt><FormattedMessage {...messages.architecture} /></dt>
            <dd>{node.getIn(['properties', 'cpu_arch'])}</dd>
            {this.renderRootDisk()}
            {this.renderBios()}
            {this.renderProduct()}
            {this.renderKernel()}
          </dl>
        </Col>
        <Col lg={4} md={6}>
          <dl className="dl-horizontal dl-horizontal-condensed">
            <dt><FormattedMessage {...messages.driver} /></dt>
            <dd>{node.get('driver')}</dd>
            {node
              .get('driver_info')
              .map((dInfo, key) => (
                <span key={key}>
                  <dt>{startCase(key)}:</dt>
                  <dd>{dInfo}</dd>
                </span>
              ))
              .toList()}
          </dl>
        </Col>
        <Col lg={3} md={6}>
          {this.renderInterfaces()}
        </Col>
      </Row>
    )
  }
}
NodeExtendedInfo.propTypes = {
  fetchNodeIntrospectionData: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  node: PropTypes.object.isRequired
}

export default injectIntl(NodeExtendedInfo)
