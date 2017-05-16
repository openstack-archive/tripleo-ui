import { FormattedDate, FormattedTime } from 'react-intl';
import { startCase } from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-bootstrap';

class NodeExtendedInfo extends React.Component {
  render() {
    const { node } = this.props;
    return (
      <Row>
        <Col lg={3} md={6}>
          <dl className="dl-horizontal dl-horizontal-condensed">
            <dt>UUID:</dt>
            <dd>{node.uuid}</dd>
            <dt>Registered:</dt>
            <dd>
              <FormattedDate value={node.created_at} />
              &nbsp;
              <FormattedTime value={node.created_at} />
            </dd>
            <dt>Architecture:</dt>
            <dd>{node.properties.cpu_arch}</dd>
          </dl>
        </Col>
        <Col lg={2} md={4}>
          <dl>
            <dt>Mac Addresses:</dt>
            {node.macs.map(mac => <dd key={mac}>{mac}</dd>)}
          </dl>
        </Col>
        <Col lg={4} md={6}>
          <dl className="dl-horizontal dl-horizontal-condensed">
            <dt>Driver:</dt>
            <dd>{node.driver}</dd>
            {Object.keys(node.driver_info).map(key => (
              <span key={key}>
                <dt>{startCase(key)}:</dt>
                <dd>{node.driver_info[key]}</dd>
              </span>
            ))}
          </dl>
        </Col>
      </Row>
    );
  }
}
NodeExtendedInfo.propTypes = {
  node: PropTypes.object.isRequired
};

export default NodeExtendedInfo;
