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
import {
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';

import { CloseModalButton, CloseModalXButton, RoutedModal } from '../ui/Modals';
import { exportPlan } from '../../actions/PlansActions';
import { Loader } from '../ui/Loader';

const messages = defineMessages({
  exportPlanName: {
    id: 'ExportPlan.exportPlanName',
    defaultMessage: 'Export {planName}'
  },
  exportingPlanLoader: {
    id: 'ExportPlan.exportingPlanLoader',
    defaultMessage: 'Exporting plan...'
  },
  downloadPlanExport: {
    id: 'ExportPlan.download',
    defaultMessage: 'Download'
  },
  downloadPlanExportMessage: {
    id: 'ExportPlan.downloadMessage',
    defaultMessage:
      'The plan export you requested is ready. Please click the button below to ' +
      'download the export. You might need to right-click the button and choose ' +
      '"Save link as...".'
  },
  exportError: {
    id: 'ExportPlan.error',
    defaultMessage: 'An error occurred while exporting the plan'
  },
  close: {
    id: 'ExportPlan.close',
    defaultMessage: 'Close'
  }
});

class ExportPlan extends React.Component {
  componentDidMount() {
    let planName = this.getNameFromUrl();
    this.props.exportPlan(planName);
  }

  getNameFromUrl() {
    let planName = this.props.match.params.planName || '';
    return planName.replace(/[^A-Za-z0-9_-]*/g, '');
  }

  render() {
    return (
      <RoutedModal
        bsSize="sm"
        id="ExportPlan__exportPlanModal"
        redirectPath="/plans/manage"
      >
        <ModalHeader>
          <CloseModalXButton />
          <ModalTitle>
            <FormattedMessage
              {...messages.exportPlanName}
              values={{ planName: this.getNameFromUrl() }}
            />
          </ModalTitle>
        </ModalHeader>
        <ModalBody className="text-center">
          <Loader
            loaded={!this.props.isExportingPlan}
            size="lg"
            height={60}
            content={this.props.intl.formatMessage(
              messages.exportingPlanLoader
            )}
          >
            {this.props.planExportUrl ? (
              <div>
                <p>
                  <FormattedMessage {...messages.downloadPlanExportMessage} />
                </p>
                <a href={this.props.planExportUrl} className="btn btn-success">
                  <FormattedMessage {...messages.downloadPlanExport} />
                </a>
              </div>
            ) : (
              <div>
                <FormattedMessage {...messages.exportError} />
              </div>
            )}
          </Loader>
        </ModalBody>
        <ModalFooter>
          <CloseModalButton id="ExportPlan__closeExportPlanModalButton">
            <FormattedMessage {...messages.close} />
          </CloseModalButton>
        </ModalFooter>
      </RoutedModal>
    );
  }
}

ExportPlan.propTypes = {
  exportPlan: PropTypes.func,
  intl: PropTypes.object,
  isExportingPlan: PropTypes.bool,
  match: PropTypes.object,
  params: PropTypes.object,
  planExportUrl: PropTypes.string
};

function mapStateToProps(state) {
  return {
    isExportingPlan: state.plans.isExportingPlan,
    planExportUrl: state.plans.planExportUrl
  };
}

function mapDispatchToProps(dispatch) {
  return {
    exportPlan: planName => dispatch(exportPlan(planName))
  };
}

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(ExportPlan)
);
