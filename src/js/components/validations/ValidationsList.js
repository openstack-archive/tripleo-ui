import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import BlankSlate from '../ui/BlankSlate';
import Loader from '../ui/Loader';
import ValidationsActions from '../../actions/ValidationsActions';
import Validation from './Validation';
import WorkflowExecutionsActions from '../../actions/WorkflowExecutionsActions';
import { getValidationsWithResults } from '../../selectors/validations';

class ValidationsList extends React.Component {
  componentDidMount() {
    this.props.fetchValidations();
  }

  refreshValidations() {
    this.props.fetchValidations();
    this.props.fetchWorkflowExecutions();
  }

  renderValidations() {
    const { validations, currentPlanName } = this.props;

    if (validations.isEmpty()) {
      return (
        <BlankSlate iconClass="pficon pficon-flag"
                    title="No Validations"
                    message="There are no validations at this time."/>
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
            runValidation={this.props.runValidation.bind(this, validation.id, currentPlanName)}
            stopValidation={this.props.stopValidation.bind(this)}
            description={validation.description}
            id={validation.id} />
        );
      });
    }
  }

  render () {
    return (
      <div className="col-sm-12 col-lg-3 sidebar-pf sidebar-pf-right">
        <div className="sidebar-header
                        sidebar-header-bleed-left
                        sidebar-header-bleed-right">
          <div className="actions pull-right">
            <Loader key="rolesLoader"
                    loaded={!(this.props.validationsLoaded &&
                              this.props.isFetchingValidations)}
                    content="Loading Validations..."
                    inline>
              <a className="link refresh"
                 onClick={this.refreshValidations.bind(this)}>
                <span className="pficon pficon-refresh"></span> Refresh
              </a>
            </Loader>
          </div>
          <h2 className="h4">Validations</h2>
        </div>
        <Loader loaded={this.props.validationsLoaded && this.props.executionsLoaded}
                content="Loading Validations..."
                height={80}>
          <div className="row">
            <div className="list-group list-view-pf">
              {this.renderValidations()}
            </div>
          </div>
        </Loader>
      </div>
    );
  }
}

ValidationsList.propTypes = {
  currentPlanName: React.PropTypes.string,
  executionsLoaded: React.PropTypes.bool.isRequired,
  fetchValidations: React.PropTypes.func.isRequired,
  fetchWorkflowExecutions: React.PropTypes.func.isRequired,
  isFetchingValidations: React.PropTypes.bool.isRequired,
  runValidation: React.PropTypes.func.isRequired,
  stopValidation: React.PropTypes.func.isRequired,
  validations: ImmutablePropTypes.map.isRequired,
  validationsLoaded: React.PropTypes.bool.isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    fetchValidations: () => dispatch(ValidationsActions.fetchValidations()),
    fetchWorkflowExecutions: () => dispatch(WorkflowExecutionsActions.fetchWorkflowExecutions()),
    runValidation: (id, currentPlanName) => {
      dispatch(ValidationsActions.runValidation(id, currentPlanName));
    },
    stopValidation: (executionId) => {
      dispatch(WorkflowExecutionsActions.updateWorkflowExecution(
        executionId,
        { state: 'PAUSED' }
      ));
    }
  };
};

const mapStateToProps = state => {
  return {
    executionsLoaded: state.executions.get('executionsLoaded'),
    isFetchingValidations: state.validations.get('isFetching'),
    validations: getValidationsWithResults(state),
    validationsLoaded: state.validations.get('validationsLoaded'),
    currentPlanName: state.currentPlan.currentPlanName
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ValidationsList);
