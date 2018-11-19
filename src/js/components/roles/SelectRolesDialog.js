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
import { Field } from 'redux-form';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { ModalHeader, ModalTitle } from 'react-bootstrap';
import React from 'react';
import { pickBy } from 'lodash';
import PropTypes from 'prop-types';

import AvailableRoleInput from './AvailableRoleInput';
import { CloseModalXButton, RoutedModalPanel } from '../ui/Modals';
import { getMergedRoles, getRoles } from '../../selectors/roles';
import { getCurrentPlanName } from '../../selectors/plans';
import { Loader } from '../ui/Loader';
import { fetchAvailableRoles, selectRoles } from '../../actions/RolesActions';
import SelectRolesForm from './SelectRolesForm';

const messages = defineMessages({
  loadingAvailableRoles: {
    id: 'SelectRolesDialog.loadingAvailableRoles',
    defaultMessage: 'Loading available Roles'
  },
  selectRolesTitle: {
    id: 'SelectRolesDialog.selectRoles',
    defaultMessage: 'Select Roles'
  }
});

class SelectRolesDialog extends React.Component {
  componentDidMount() {
    this.props.fetchAvailableRoles(this.props.currentPlanName);
  }

  handleFormSubmit = (values, dispatch, formProps) => {
    const roleNames = Object.keys(pickBy(values));
    this.props.selectRoles(this.props.currentPlanName, roleNames);
  };

  render() {
    const {
      availableRoles,
      availableRolesLoaded,
      fetchingAvailableRoles,
      intl: { formatMessage },
      currentPlanName,
      roles
    } = this.props;
    return (
      <RoutedModalPanel redirectPath={`/plans/${currentPlanName}`}>
        <ModalHeader>
          <CloseModalXButton />
          <ModalTitle>
            <FormattedMessage {...messages.selectRolesTitle} />
          </ModalTitle>
        </ModalHeader>
        <Loader
          height={100}
          loaded={availableRolesLoaded && !fetchingAvailableRoles}
          content={formatMessage(messages.loadingAvailableRoles)}
          componentProps={{ className: 'flex-container' }}
        >
          <SelectRolesForm
            onSubmit={this.handleFormSubmit}
            initialValues={availableRoles
              .map((_, key) => roles.keySeq().includes(key))
              .toJS()}
            availableRoles={availableRoles}
            currentPlanName={currentPlanName}
          >
            {availableRoles
              .toList()
              .map(role => (
                <Field
                  component={AvailableRoleInput}
                  role={role}
                  name={role.name}
                  key={role.name}
                />
              ))}
          </SelectRolesForm>
        </Loader>
      </RoutedModalPanel>
    );
  }
}
SelectRolesDialog.propTypes = {
  availableRoles: ImmutablePropTypes.map.isRequired,
  availableRolesLoaded: PropTypes.bool.isRequired,
  currentPlanName: PropTypes.string.isRequired,
  fetchAvailableRoles: PropTypes.func.isRequired,
  fetchingAvailableRoles: PropTypes.bool.isRequired,
  intl: PropTypes.object.isRequired,
  roles: ImmutablePropTypes.map.isRequired,
  selectRoles: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  availableRoles: getMergedRoles(state),
  availableRolesLoaded: state.availableRoles.loaded,
  fetchingAvailableRoles: state.availableRoles.isFetching,
  currentPlanName: getCurrentPlanName(state),
  roles: getRoles(state)
});

export default injectIntl(
  connect(mapStateToProps, { fetchAvailableRoles, selectRoles })(
    SelectRolesDialog
  )
);
