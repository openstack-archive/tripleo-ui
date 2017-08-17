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

import ImmutablePropTypes from 'react-immutable-proptypes';
import PropTypes from 'prop-types';
import React from 'react';

import { ValidationStatusIcon } from './ValidationStatusIcon';

export default class Validation extends React.Component {
  constructor() {
    super();
    this.state = { isPending: false };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isPending: false });
  }

  /**
   * Decide which validation action to run, if validation is pending (waits for execution to be
   * started) no action can be run
   */
  triggerValidationAction() {
    this.setState({ isPending: true });

    switch (true) {
      case this.state.isPending:
        break;
      case this.props.status === 'running':
        this.props.stopValidation(this.props.results.last().id);
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
          <span
            className="label label-default"
            onClick={() =>
              this.props.addActiveFilter({
                filterBy: 'group',
                filterString: group
              })}
          >
            <small>
              {group}
            </small>
          </span>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="list-group-item list-view-pf-stacked validation">
        <div className="list-view-pf-main-info">
          <div className="list-view-pf-left">
            <ValidationStatusIcon
              status={this.state.isPending ? 'running' : this.props.status}
              triggerValidationAction={this.triggerValidationAction.bind(this)}
            />
          </div>
          <div className="list-view-pf-body">
            <div className="list-view-pf-description">
              <div className="list-group-item-heading">
                <a
                  className="link"
                  onClick={() => this.props.showValidationDetail()}
                  title={this.props.name}
                >
                  {this.props.name}
                </a>
              </div>
              <div className="list-group-item-text">
                <small title={this.props.description}>
                  {this.props.description}
                </small>
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
  addActiveFilter: PropTypes.func.isRequired,
  description: PropTypes.string,
  groups: ImmutablePropTypes.list.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  results: ImmutablePropTypes.map.isRequired,
  runValidation: PropTypes.func.isRequired,
  showValidationDetail: PropTypes.func.isRequired,
  status: PropTypes.string,
  stopValidation: PropTypes.func.isRequired
};
