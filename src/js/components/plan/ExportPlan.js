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
import React, { PropTypes } from 'react';
import { Link } from 'react-router';

import PlansActions from '../../actions/PlansActions';
import Loader from '../ui/Loader';
import Modal from '../ui/Modal';

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
    defaultMessage: 'Download Export'
  },
  downloadPlanExportMessage: {
    id: 'ExportPlan.downloadMessage',
    defaultMessage: 'The plan export you requested is ready. Please click the button below to ' +
                    'download the export. You might need to right-click the button and choose ' +
                    '"Save link as...".'
  },
  exportError: {
    id: 'ExportPlan.error',
    defaultMessage: 'An error occurred while exporting the plan'
  },
  cancel: {
    id: 'ExportPlan.cancel',
    defaultMessage: 'Cancel'
  }
});

class ExportPlan extends React.Component {
  componentDidMount() {
    let planName = this.getNameFromUrl();
    this.props.exportPlan(planName);
  }

  getNameFromUrl() {
    let planName = this.props.params.planName || '';
    return planName.replace(/[^A-Za-z0-9_-]*/g, '');
  }

  render () {
    return (
      <Modal dialogClasses="modal-sm" id="ExportPlan__exportPlanModal">
        <div className="modal-header">
          <Link to="/plans/list"
                type="button"
                className="close">
            <span aria-hidden="true" className="pficon pficon-close"/>
          </Link>
          <h4 className="modal-title">
            <FormattedMessage
              {...messages.exportPlanName}
              values={{planName: this.getNameFromUrl()}}
            />
          </h4>
        </div>
        <div className="modal-body text-center">
          <Loader loaded={!this.props.isExportingPlan}
                  size="lg"
                  height={60}
                  content={this.props.intl.formatMessage(messages.exportingPlanLoader)}>
            {this.props.planExportUrl ?
              <div>
                <div><FormattedMessage {...messages.downloadPlanExportMessage}/></div>
                <br />
                <a href={this.props.planExportUrl}
                   className="btn btn-success">
                  <FormattedMessage {...messages.downloadPlanExport}/>
                </a>
              </div>
              :
              <div>
                <FormattedMessage {...messages.exportError}/>
              </div>
            }
          </Loader>
        </div>
        <div className="modal-footer">
          <Link to="/plans/list"
                type="button"
                className="btn btn-default"
                id="ExportPlan__cancelExportPlanModalButton">
            <FormattedMessage {...messages.cancel}/>
          </Link>
        </div>
      </Modal>
    );
  }
}

ExportPlan.propTypes = {
  exportPlan: PropTypes.func,
  intl: PropTypes.object,
  isExportingPlan: PropTypes.bool,
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
    exportPlan: planName => dispatch(PlansActions.exportPlan(planName))
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ExportPlan));
