import { connect } from 'react-redux';
import { defineMessages, FormattedMessage } from 'react-intl';
import React from 'react';
import { Link } from 'react-router';

import PlansActions from '../../actions/PlansActions';
import Modal from '../ui/Modal';

const messages = defineMessages({
  exportPlanName: {
    id: 'ExportPlan.exportPlanName',
    defaultMessage: 'Export {planName}'
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
        <div className="modal-body">
          Plan link here
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
  exportPlan: React.PropTypes.func,
  params: React.PropTypes.object
};

function mapDispatchToProps(dispatch) {
  return {
    exportPlan: planName => {
      dispatch(PlansActions.exportPlan(planName));
    }
  };
}

export default connect(null, mapDispatchToProps)(ExportPlan);
