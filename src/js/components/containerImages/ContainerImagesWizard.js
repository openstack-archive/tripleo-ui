/**
 * Copyright 2018 Red Hat Inc.
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

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { Wizard, Modal } from 'patternfly-react';
import yaml from 'js-yaml';

import { checkRunningDeployment } from '../utils/checkRunningDeploymentHOC';
import { getCurrentPlanName } from '../../selectors/plans';
import { Loader } from '../ui/Loader';
import { fetchParameters } from '../../actions/ParametersActions';
import { startContainerImagesPrepare } from '../../actions/ContainerImagesActions';
import { RoutedWizard, CloseModalXButton } from '../ui/Modals';
import ContainerImagesPrepareForm from './ContainerImagesPrepareForm';
import {
  getContainerImagePrepareParameterSeed,
  getContainerImagePrepareParameter
} from '../../selectors/parameters';
import ContainerImagesPrepareFormActions from './ContainerImagesPrepareFormActions';
import ContainerImagePrepareParameterForm from './ContainerImagePrepareParameterForm';
import ContainerImagePrepareParameterFormActions from './ContainerImagePrepareParameterFormActions';

const messages = defineMessages({
  title: {
    id: 'ContainerImagesWizard.title',
    defaultMessage: 'Prepare Container Images'
  },
  loadingData: {
    id: 'ContainerImagesWizard.loadingData',
    defaultMessage: 'Loading configuration...'
  },
  configureImages: {
    id: 'ContainerImagesWizard.configureImages',
    defaultMessage: 'Configure Images'
  },
  review: {
    id: 'ContainerImagesWizard.review',
    defaultMessage: 'Review Configuration'
  }
});

class ContainerImagesWizard extends Component {
  state = {
    activeStepIndex: 0
  };

  componentDidMount() {
    const {
      currentPlanName,
      fetchParameters,
      isFetchingParameters
    } = this.props;
    !isFetchingParameters && fetchParameters(currentPlanName);
  }

  setActiveStepIndex(index) {
    this.setState({ activeStepIndex: index });
  }

  render() {
    const {
      currentPlanName,
      intl: { formatMessage },
      isFetchingParameters,
      containerImagePrepareParameterSeed,
      containerImagePrepareParameter,
      resetToDefaults
    } = this.props;

    const { activeStepIndex } = this.state;

    const steps = [
      {
        step: 1,
        label: '1',
        title: formatMessage(messages.configureImages)
      },
      {
        step: 2,
        label: '2',
        title: formatMessage(messages.review)
      }
    ];

    return (
      <RoutedWizard
        id="ContainerImagesWizard__Wizard"
        redirectPath={`/plans/${currentPlanName}`}
      >
        <Modal.Header>
          <CloseModalXButton />
          <Modal.Title>
            <FormattedMessage {...messages.title} />
          </Modal.Title>
        </Modal.Header>
        <Wizard.Body>
          <Wizard.Steps
            steps={steps.map(({ step, label, title }, index) => (
              <Wizard.Step
                key={step}
                stepIndex={index}
                step={step}
                label={label}
                title={title}
                activeStep={steps[activeStepIndex].step}
                onClick={() => this.setActiveStepIndex(index)}
              />
            ))}
          />
          <Loader
            height={60}
            loaded={!isFetchingParameters}
            content={formatMessage(messages.loadingData)}
          >
            {activeStepIndex === 0 ? (
              <ContainerImagesPrepareForm
                onSubmit={this.handleContainerImagesPrepareFormSubmit}
                initialValues={{
                  ...containerImagePrepareParameterSeed,
                  push_destination:
                    containerImagePrepareParameterSeed.push_destination || false
                }}
                resetToDefaults={resetToDefaults}
              />
            ) : (
              <ContainerImagePrepareParameterForm
                parameter={containerImagePrepareParameter}
                currentPlanName={currentPlanName}
                initialValues={{
                  [containerImagePrepareParameter.name]: yaml.safeDump(
                    containerImagePrepareParameter.default
                  )
                }}
              />
            )}
          </Loader>
        </Wizard.Body>
        <Wizard.Footer>
          {activeStepIndex === 0 && (
            <ContainerImagesPrepareFormActions
              goForward={() => this.setActiveStepIndex(1)}
            />
          )}
          {activeStepIndex === 1 && (
            <ContainerImagePrepareParameterFormActions
              goBack={() => this.setActiveStepIndex(0)}
            />
          )}
        </Wizard.Footer>
      </RoutedWizard>
    );
  }
}
ContainerImagesWizard.propTypes = {
  containerImagePrepareParameter: ImmutablePropTypes.record.isRequired,
  containerImagePrepareParameterSeed: PropTypes.object.isRequired,
  currentPlanName: PropTypes.string.isRequired,
  fetchParameters: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  isFetchingParameters: PropTypes.bool.isRequired,
  resetToDefaults: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  containerImagePrepareParameterSeed: getContainerImagePrepareParameterSeed(
    state
  ),
  containerImagePrepareParameter: getContainerImagePrepareParameter(state),
  currentPlanName: getCurrentPlanName(state),
  isFetchingParameters: state.parameters.isFetching
});

const mapDispatchToProps = dispatch => ({
  fetchParameters: currentPlanName =>
    dispatch(fetchParameters(currentPlanName)),
  resetToDefaults: () => dispatch(startContainerImagesPrepare({}))
});

export default checkRunningDeployment(
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(ContainerImagesWizard)
  )
);
