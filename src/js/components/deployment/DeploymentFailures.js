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
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { Table } from 'patternfly-react';
import { Panel } from 'react-bootstrap';

import { getCurrentPlanName } from '../../selectors/plans';
import { getDeploymentFailures } from '../../actions/DeploymentActions';
import { Loader } from '../ui/Loader';
import { sanitizeMessage } from '../../utils';

const messages = defineMessages({
  viewDetails: {
    id: 'DeploymentFailures.viewDetails',
    defaultMessage: 'View details'
  },
  loadingFailures: {
    id: 'DeploymentFailures.loadingDeploymentFailures',
    defaultMessage: 'Loading failures'
  },
  title: {
    id: 'DeploymentFailures.title',
    defaultMessage: 'Deployment Configuration Failures'
  },
  failuresTableDescription: {
    id: 'DeploymentFailures.failuresTableDescription',
    defaultMessage:
      'Deployment configuration phase failed, following is a list of failures provided from ansible run:'
  },
  nodeTableColumnLabel: {
    id: 'DeploymentFailures.nodeTableColumnLabel',
    defaultMessage: 'Node'
  },
  taskTableColumnLabel: {
    id: 'DeploymentFailures.taskTableColumnLabel',
    defaultMessage: 'Task'
  },
  outputsTableColumnLabel: {
    id: 'DeploymentFailures.outputsTableColumnLabel',
    defaultMessage: 'Outputs'
  },
  noDeploymentFailures: {
    id: 'DeploymentFailures.noDeploymentFailures',
    defaultMessage: 'No deployment failures to display'
  }
});

class DeploymentFailures extends Component {
  componentDidMount() {
    this.props.getDeploymentFailures(this.props.planName);
  }

  render() {
    const {
      deploymentFailures,
      failuresLoaded,
      intl: { formatMessage }
    } = this.props;

    const headerFormat = value => <Table.Heading>{value}</Table.Heading>;
    const nodeCellFormat = value => <Table.Cell>{value}</Table.Cell>;
    const taskCellFormat = value => <Table.Cell>{value}</Table.Cell>;
    const outputsCellFormat = outputs => (
      <Table.Cell>
        <Panel className="panel-deployment-failures">
          <Panel.Heading>
            <Panel.Toggle className="pull-right">
              <FormattedMessage {...messages.viewDetails} />
            </Panel.Toggle>
            {sanitizeMessage(outputs.msg)}
            <div className="clearfix" />
          </Panel.Heading>
          <Panel.Collapse>
            <pre>{JSON.stringify(outputs, null, 2)}</pre>
          </Panel.Collapse>
        </Panel>
      </Table.Cell>
    );

    const deploymentFailuresBlankSlate = (
      <tbody>
        <tr>
          <td className="blank-slate-pf" colSpan={3}>
            <Loader
              loaded={failuresLoaded}
              content={formatMessage(messages.loadingFailures)}
            >
              <h1>
                <FormattedMessage {...messages.noDeploymentFailures} />
              </h1>
            </Loader>
          </td>
        </tr>
      </tbody>
    );

    const rows = [];
    deploymentFailures
      .toList()
      .toJS()
      .forEach(node =>
        node.tasks.forEach(task => rows.push({ node: node.node, ...task }))
      );

    return (
      <Fragment>
        <h3>
          <FormattedMessage {...messages.title} />
        </h3>
        <p>
          <FormattedMessage {...messages.failuresTableDescription} />
        </p>
        <Table.PfProvider
          striped
          bordered
          hover
          columns={[
            {
              header: {
                label: formatMessage(messages.nodeTableColumnLabel),
                formatters: [headerFormat]
              },
              cell: { formatters: [nodeCellFormat] },
              property: 'node'
            },
            {
              header: {
                label: formatMessage(messages.taskTableColumnLabel),
                formatters: [headerFormat]
              },
              cell: { formatters: [taskCellFormat] },
              property: 'taskName'
            },
            {
              header: {
                label: formatMessage(messages.outputsTableColumnLabel),
                formatters: [headerFormat]
              },
              cell: { formatters: [outputsCellFormat] },
              property: 'outputs'
            }
          ]}
        >
          <Table.Header />
          {deploymentFailures.size ? (
            <Table.Body
              rows={rows}
              rowKey={({ rowData, rowIndex }) =>
                `${rowData.node}-${rowData.taskName}`
              }
            />
          ) : (
            deploymentFailuresBlankSlate
          )}
        </Table.PfProvider>
      </Fragment>
    );
  }
}
DeploymentFailures.propTypes = {
  deploymentFailures: ImmutablePropTypes.map.isRequired,
  failuresLoaded: PropTypes.bool,
  getDeploymentFailures: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  planName: PropTypes.string.isRequired
};
const mapStateToProps = state => ({
  planName: getCurrentPlanName(state),
  deploymentFailures: state.deploymentFailures.failures,
  failuresLoaded: state.deploymentFailures.loaded
});
const mapDispatchToProps = dispatch => ({
  getDeploymentFailures: planName => dispatch(getDeploymentFailures(planName))
});
export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(DeploymentFailures)
);
