import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';

import BlankSlate from '../ui/BlankSlate';
import Loader from '../ui/Loader';
import ValidationsActions from '../../actions/ValidationsActions';
import ValidationsToolbar from './ValidationsToolbar';
import Validation from './Validation';
import ValidationDetail from './ValidationDetail';
import WorkflowExecutionsActions from '../../actions/WorkflowExecutionsActions';
import { getFilteredValidations } from '../../selectors/validations';

const messages = defineMessages({
  loadingValidations: {
    id: 'ValidationsList.loadingValidations',
    defaultMessage: 'Loading Validations...'
  },
  noValidations: {
    id: 'ValidationsList.noValidations',
    defaultMessage: 'No Validations'
  },
  noValidationsMessage: {
    id: 'ValidationsList.noValidationsMessage',
    defaultMessage: 'There are no validations at this time.'
  },
  refresh: {
    id: 'ValidationsList.refresh',
    defaultMessage: 'Refresh'
  },
  validations: {
    id: 'ValidationsList.validations',
    defaultMessage: 'Validations'
  }
});

class ValidationsList extends React.Component {
  constructor() {
    super();
    this.state = {
      showDetail: null
    };
  }

  componentDidMount() {
    this.props.fetchValidations();
  }

  refreshValidations() {
    this.props.fetchValidations();
    this.props.fetchWorkflowExecutions();
  }

  showValidationDetail(uuid) {
    this.setState({ showDetail: uuid });
  }

  hideValidationDetail() {
    this.setState({ showDetail: null });
  }

  rendervalidationDetail() {
    if (this.state.showDetail) {
      const validation = this.props.validations.get(this.state.showDetail);
      return (
        <ValidationDetail
          description={validation.description}
          groups={validation.groups}
          hideValidationDetail={this.hideValidationDetail.bind(this)}
          name={validation.name}
          results={validation.results}
          runValidation={this.props.runValidation.bind(
            this,
            validation.id,
            this.props.currentPlanName
          )}
          status={validation.status}
          stopValidation={this.props.stopValidation.bind(this)}
        />
      );
    }
  }

  renderValidations() {
    const { validations, currentPlanName } = this.props;

    if (validations.isEmpty()) {
      return (
        <BlankSlate
          iconClass="pficon pficon-flag"
          title={this.props.intl.formatMessage(messages.noValidations)}
        >
          <p><FormattedMessage {...messages.noValidationsMessage} /></p>
        </BlankSlate>
      );
    } else {
      return validations.toList().map(validation => {
        return (
          <Validation
            key={validation.id}
            name={validation.name}
            results={validation.results}
            status={validation.status}
            groups={validation.groups}
            showValidationDetail={this.showValidationDetail.bind(
              this,
              validation.id
            )}
            runValidation={this.props.runValidation.bind(
              this,
              validation.id,
              currentPlanName
            )}
            stopValidation={this.props.stopValidation.bind(this)}
            description={validation.description}
            id={validation.id}
          />
        );
      });
    }
  }

  render() {
    const { formatMessage } = this.props.intl;

    return (
      <div className="col-sm-12 col-lg-3 sidebar-pf sidebar-pf-right fixed-container validations">
        <div className="sidebar-header
                        sidebar-header-bleed-left
                        sidebar-header-bleed-right
                        fixed-container-header">
          <div className="actions pull-right">
            <Loader
              loaded={
                !(this.props.validationsLoaded &&
                  this.props.isFetchingValidations)
              }
              content={formatMessage(messages.loadingValidations)}
              inline
            >
              <a
                className="link refresh"
                onClick={this.refreshValidations.bind(this)}
              >
                <span className="pficon pficon-refresh" />
                {' '}
                <FormattedMessage {...messages.refresh} />
              </a>
            </Loader>
          </div>
          <h2 className="h4"><FormattedMessage {...messages.validations} /></h2>
        </div>
        <Loader
          loaded={this.props.validationsLoaded && this.props.executionsLoaded}
          content={formatMessage(messages.loadingValidations)}
          componentProps={{ className: 'row fixed-container-body' }}
          height={80}
        >
          <ValidationsToolbar />
          <div className="list-group list-view-pf validation-list">
            {this.renderValidations()}
          </div>
        </Loader>
        {this.rendervalidationDetail()}
      </div>
    );
  }
}

ValidationsList.propTypes = {
  currentPlanName: PropTypes.string,
  executionsLoaded: PropTypes.bool.isRequired,
  fetchValidations: PropTypes.func.isRequired,
  fetchWorkflowExecutions: PropTypes.func.isRequired,
  intl: PropTypes.object,
  isFetchingValidations: PropTypes.bool.isRequired,
  runValidation: PropTypes.func.isRequired,
  stopValidation: PropTypes.func.isRequired,
  validations: ImmutablePropTypes.map.isRequired,
  validationsLoaded: PropTypes.bool.isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    fetchValidations: () => dispatch(ValidationsActions.fetchValidations()),
    fetchWorkflowExecutions: () =>
      dispatch(WorkflowExecutionsActions.fetchWorkflowExecutions()),
    runValidation: (id, currentPlanName) => {
      dispatch(ValidationsActions.runValidation(id, currentPlanName));
    },
    stopValidation: executionId => {
      dispatch(
        WorkflowExecutionsActions.updateWorkflowExecution(executionId, {
          state: 'PAUSED'
        })
      );
    }
  };
};

const mapStateToProps = state => {
  return {
    executionsLoaded: state.executions.get('executionsLoaded'),
    isFetchingValidations: state.validations.get('isFetching'),
    validations: getFilteredValidations(state),
    validationsLoaded: state.validations.get('validationsLoaded'),
    currentPlanName: state.currentPlan.currentPlanName
  };
};

export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(ValidationsList)
);
