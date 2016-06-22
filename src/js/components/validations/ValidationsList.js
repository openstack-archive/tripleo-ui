import { connect } from 'react-redux';
import ImmutablePropTypes from 'react-immutable-proptypes';
import React from 'react';

import BlankSlate from '../ui/BlankSlate';
import Loader from '../ui/Loader';
import ValidationsActions from '../../actions/ValidationsActions';
import Validation from './Validation';

class ValidationsList extends React.Component {
  componentDidMount() {
    this.props.fetchValidations();
  }

  renderValidations() {
    if (this.props.validations.isEmpty()) {
      return (
        <BlankSlate iconClass="pficon pficon-flag"
                    title="No Validations"
                    message="There are no validations at this time." />
      );
    } else {
      return this.props.validations.toList().map(validation => {
        return (
          <Validation key={validation.id}
                      name={validation.name}
                      status="new"
                      groups={validation.groups}
                      runValidation={this.props.runValidation}
                      stopValidation={this.props.stopValidation}
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
                 onClick={this.props.fetchValidations.bind(this)}>
                <span className="pficon pficon-refresh"></span> Refresh
              </a>
            </Loader>
          </div>
          <h2 className="h4">Validations</h2>
        </div>
        <Loader loaded={this.props.validationsLoaded}
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
  fetchValidations: React.PropTypes.func.isRequired,
  isFetchingValidations: React.PropTypes.bool.isRequired,
  runValidation: React.PropTypes.func.isRequired,
  runValidationGroup: React.PropTypes.func.isRequired,
  stopValidation: React.PropTypes.func.isRequired,
  validations: ImmutablePropTypes.map.isRequired,
  validationsLoaded: React.PropTypes.bool.isRequired,
  validationsStatusCounts: ImmutablePropTypes.record.isRequired
};

const mapDispatchToProps = dispatch => {
  return {
    fetchValidations: () => dispatch(ValidationsActions.fetchValidations()),
    runValidationGroup: (group) => {
      dispatch(ValidationsActions.runValidationGroup(group));
    },
    runValidation: (id) => {
      dispatch(ValidationsActions.runValidation(id));
    },
    stopValidation: (id) => {
      dispatch(ValidationsActions.stopValidation(id));
    },
    toggleValidationStageVisibility: (uuid) => {
      dispatch(ValidationsActions.toggleValidationStageVisibility(uuid));
    }
  };
};

const mapStateToProps = state => {
  return {
    isFetchingValidations: state.validations.get('isFetching'),
    validations: state.validations.get('validations'),
    validationsLoaded: state.validations.get('validationsLoaded')
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ValidationsList);
