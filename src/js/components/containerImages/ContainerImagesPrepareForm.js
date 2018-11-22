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

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, FormattedMessage, injectIntl } from 'react-intl';
import { Form, FieldLevelHelp, Wizard } from 'patternfly-react';
import { reduxForm, Field } from 'redux-form';
import { format } from 'redux-form-validators';

import { OverlayLoader } from '../ui/Loader';
import FormErrorList from '../ui/forms/FormErrorList';
import HorizontalInput from '../ui/reduxForm/HorizontalInput';
import { startContainerImagesPrepare } from '../../actions/ContainerImagesActions';
import PushDestinationInput from './PushDestinationInput';
import {
  IPV4_WITH_PORT_REGEX,
  DOCKER_TAG_REGEX,
  DOCKER_REGISTRY_NAMESPACE_REGEX
} from '../../utils/regex';

const messages = defineMessages({
  generatingConfiguration: {
    id: 'ContainerImagesPrepareForm.generatingConfiguration',
    defaultMessage: 'Generating container images configuration...'
  },
  namespaceLabel: {
    id: 'ContainerImagesPrepareForm.namespaceLabel',
    defaultMessage: 'Registry Namespace'
  },
  namespaceInvalid: {
    id: 'ContainerImagesPrepareForm.namespaceInvalid',
    defaultMessage: 'Provide a valid registry address and images namespace'
  },
  namePrefixLabel: {
    id: 'ContainerImagesPrepareForm.namePrefixLabel',
    defaultMessage: 'Name Prefix'
  },
  nameSuffixLabel: {
    id: 'ContainerImagesPrepareForm.nameSuffixLabel',
    defaultMessage: 'Name Suffix'
  },
  tagLabel: {
    id: 'ContainerImagesPrepareForm.tagLabel',
    defaultMessage: 'Tag'
  },
  tagFromLabelLabel: {
    id: 'ContainerImagesPrepareForm.tagFromLabelLabel',
    defaultMessage: 'Tag from Label'
  },
  pushDestinationLabel: {
    id: 'ContainerImagesPrepareForm.pushDestinationLabel',
    defaultMessage: 'Push Destination'
  },
  pushDestinationUndercloud: {
    id: 'ContainerImagesPrepareForm.pushDestinationUndercloud',
    defaultMessage: 'Undercloud image registry'
  },
  namespaceDescription: {
    id: 'ContainerImagesPrepareForm.namespaceDescription',
    defaultMessage:
      'Namespace of the remote registry from which the container images will be pulled during deployment.'
  },
  namePrefixDescription: {
    id: 'ContainerImagesPrepareForm.namePrefixDescription',
    defaultMessage: 'Container image name prefix.'
  },
  nameSuffixDescription: {
    id: 'ContainerImagesPrepareForm.nameSuffixDescription',
    defaultMessage: 'Container image name suffix.'
  },
  tagDescription: {
    id: 'ContainerImagesPrepareForm.tagDescription',
    defaultMessage: 'Tag representing the latest image version.'
  },
  pushDestinationDescription: {
    id: 'ContainerImagesPrepareForm.pushDestinationDescription',
    defaultMessage:
      'By specifying a Push Destination, the required images will be copied \
      from provided namespace to this registry. As part of the undercloud \
      install, an image registry is configured on port 8787. This can be used \
      to increase reliability of image pulls, and minimise overall network \
      transfers. Alternatively it is possible to explicitly specify the \
      registry to push the images to.'
  },
  pushDestinationValidationMessage: {
    id: 'ContainerImagesPrepareForm.pushDestinationValidationMessage',
    defaultMessage: 'Please enter a valid IPv4 address and port'
  },
  tagFromLabelDescription: {
    id: 'ContainerImagesPrepareForm.tagFromLabelDescription',
    defaultMessage:
      'Provide a label to discover the versioned tag for images. Some build \
      pipelines have a versioned tag which can only be discovered via a \
      combination of labels. For this case, a template format can be specified \
      instead, e.g. {labelExample}. If you want these parameters to have \
      the actual tag instead of the discovered tag, this entry can be omitted.'
  }
});

class ContainerImagesPrepareForm extends Component {
  componentDidMount() {
    const { initialValues: { namespace }, resetToDefaults } = this.props;
    if (!namespace) {
      resetToDefaults();
    }
  }

  validatePushDestination(value) {
    if (typeof value === 'boolean') {
      return undefined;
    } else if (new RegExp(IPV4_WITH_PORT_REGEX).test(value)) {
      return undefined;
    } else {
      return (
        <FormattedMessage {...messages.pushDestinationValidationMessage} />
      );
    }
  }

  render() {
    const {
      error,
      intl: { formatMessage },
      submitting,
      handleSubmit
    } = this.props;
    return (
      <Form onSubmit={handleSubmit} horizontal>
        <OverlayLoader
          loaded={!submitting}
          content={formatMessage(messages.generatingConfiguration)}
        >
          <Wizard.Row>
            <Wizard.Main>
              <Wizard.Contents stepIndex={0} activeStepIndex={0}>
                <FormErrorList errors={error ? [error] : []} />
                <fieldset>
                  <Field
                    name="namespace"
                    component={HorizontalInput}
                    id="namespace"
                    label={
                      <Fragment>
                        <FormattedMessage {...messages.namespaceLabel} />
                        <FieldLevelHelp
                          placement="right"
                          style={{ maxWidth: 400 }}
                          content={formatMessage(messages.namespaceDescription)}
                        />
                      </Fragment>
                    }
                    labelColumns={4}
                    validate={format({
                      with: DOCKER_REGISTRY_NAMESPACE_REGEX,
                      message: formatMessage(messages.namespaceInvalid),
                      allowBlank: true
                    })}
                  />
                  <Field
                    name="name_prefix"
                    component={HorizontalInput}
                    id="name_prefix"
                    label={
                      <Fragment>
                        <FormattedMessage {...messages.namePrefixLabel} />
                        <FieldLevelHelp
                          placement="right"
                          style={{ maxWidth: 400 }}
                          content={formatMessage(
                            messages.namePrefixDescription
                          )}
                        />
                      </Fragment>
                    }
                    labelColumns={4}
                    inputColumns={4}
                  />
                  <Field
                    name="name_suffix"
                    component={HorizontalInput}
                    id="name_suffix"
                    label={
                      <Fragment>
                        <FormattedMessage {...messages.nameSuffixLabel} />
                        <FieldLevelHelp
                          placement="right"
                          style={{ maxWidth: 400 }}
                          content={formatMessage(
                            messages.nameSuffixDescription
                          )}
                        />
                      </Fragment>
                    }
                    labelColumns={4}
                    inputColumns={4}
                  />
                  <Field
                    name="tag"
                    component={HorizontalInput}
                    id="tag"
                    label={
                      <Fragment>
                        <FormattedMessage {...messages.tagLabel} />
                        <FieldLevelHelp
                          placement="right"
                          style={{ maxWidth: 400 }}
                          content={formatMessage(messages.tagDescription)}
                        />
                      </Fragment>
                    }
                    validate={format({
                      with: DOCKER_TAG_REGEX,
                      allowBlank: true
                    })}
                    labelColumns={4}
                    inputColumns={4}
                  />
                </fieldset>
                <fieldset>
                  <Field
                    name="push_destination"
                    component={PushDestinationInput}
                    id="push_destination"
                    label={
                      <Fragment>
                        <FormattedMessage {...messages.pushDestinationLabel} />
                        <FieldLevelHelp
                          placement="right"
                          style={{ maxWidth: 400 }}
                          content={formatMessage(
                            messages.pushDestinationDescription
                          )}
                        />
                      </Fragment>
                    }
                    labelColumns={4}
                    validate={this.validatePushDestination}
                  />
                  <Field
                    name="tag_from_label"
                    component={HorizontalInput}
                    id="tag_from_label"
                    label={
                      <Fragment>
                        <FormattedMessage {...messages.tagFromLabelLabel} />
                        <FieldLevelHelp
                          placement="right"
                          style={{ maxWidth: 400 }}
                          content={formatMessage(
                            messages.tagFromLabelDescription,
                            {
                              labelExample: '{version}-{release}'
                            }
                          )}
                        />
                      </Fragment>
                    }
                    labelColumns={4}
                    inputColumns={4}
                  />
                </fieldset>
              </Wizard.Contents>
            </Wizard.Main>
          </Wizard.Row>
        </OverlayLoader>
      </Form>
    );
  }
}
ContainerImagesPrepareForm.propTypes = {
  error: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  resetToDefaults: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
};

const normalizeValues = values => {
  const generateIfEmpty = ['namespace', 'tag', 'push_destination'];
  Object.keys(values).map(key => {
    if (generateIfEmpty.includes(key)) {
      !values[key] && delete values[key];
    }
  });
  return values;
};

const form = reduxForm({
  form: 'containerImagesPrepareForm',
  onSubmit: (values, dispatch, props) => {
    normalizeValues(values);
    dispatch(startContainerImagesPrepare(values));
  },
  touchOnChange: true,
  enableReinitialize: true
});

export default injectIntl(form(ContainerImagesPrepareForm));
