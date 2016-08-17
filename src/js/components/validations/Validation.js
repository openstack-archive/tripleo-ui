import { includes } from 'lodash';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ClassNames from 'classnames';
import React from 'react';

export default class Validation extends React.Component {
  constructor() {
    super();
    this.state = { isPending: false };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isPending: false });
  }

  triggerValidationAction() {
    this.setState({ isPending: true });
    switch (this.props.status) {
    case ('running'):
      this.props.stopValidation();
      break;
    default:
      this.props.runValidation();
      break;
    }
  }

  renderValidationGroups() {
    return this.props.groups.map(group => {
      return (
        <div key={group} className="list-view-pf-additional-info-item">
          <small>
            <span className="label label-default">{group}</span>
          </small>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="list-group-item list-view-pf-stacked validation">
        <div className="list-view-pf-main-info">
          <div className="list-view-pf-left">
            <ValidationStatusIcon status={this.state.isPending ? 'running' : this.props.status}
                                  triggerValidationAction={this.triggerValidationAction.bind(this)}
                                  stopValidation={this.props.stopValidation}/>
          </div>
          <div className="list-view-pf-body">
            <div className="list-view-pf-description">
              <div className="list-group-item-heading">
                <span title={this.props.name}>{this.props.name}</span>
              </div>
              <div className="list-group-item-text">
                <small title={this.props.description}>{this.props.description}</small>
              </div>
            </div>
            <div className="list-view-pf-additional-info">
              {this.renderValidationGroups()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Validation.propTypes = {
  description: React.PropTypes.string,
  groups: ImmutablePropTypes.list.isRequired,
  id: React.PropTypes.string.isRequired,
  name: React.PropTypes.string.isRequired,
  results: ImmutablePropTypes.map.isRequired,
  runValidation: React.PropTypes.func.isRequired,
  status: React.PropTypes.string,
  stopValidation: React.PropTypes.func.isRequired
};


const ValidationStatusIcon = ({ status, triggerValidationAction }) => {
  const statusIconClass = ClassNames({
    'list-view-pf-icon-md' :              true,
    'running fa fa-stop-circle':          status === 'running',
    'pficon pficon-error-circle-o front': status === 'failed',
    'pficon pficon-ok front':             status === 'success',
    'fa fa-play-circle':                  status === 'new'
  });

  switch (true) {
  case (includes(['new', 'running'], status)):
    return (
      <a className="link"
         onClick={triggerValidationAction}>
        <span className={statusIconClass}/>
      </a>
    );
  case (includes(['success', 'failed'], status)):
    return (
      <a className="link flip-container" onClick={triggerValidationAction}>
        <div className="flipper">
          <span className={statusIconClass}/>
          <span className="list-view-pf-icon-md fa fa-play-circle back"/>
        </div>
      </a>
    );
  default:
    return <span className="list-view-pf-icon-md pficon pficon-help"/>;
  }
};
ValidationStatusIcon.propTypes = {
  status: React.PropTypes.string,
  triggerValidationAction: React.PropTypes.func.isRequired
};
