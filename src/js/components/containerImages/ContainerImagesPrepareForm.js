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

import React, { Fragment } from 'react';
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
import { FQDN_REGEX } from '../../utils/regex';

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
    defaultMessage: 'Invalid namespace'
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
  tagFromLabelDescription: {
    id: 'ContainerImagesPrepareForm.tagFromLabelDescription',
    defaultMessage:
      'Provide a label to discover the versioned tag for images. Some build \
      pipelines have a versioned tag which can only be discovered via a \
      combination of labels. For this case, a template format can be specified \
      instead, e.g. {labelExample}. If you want these parameters to have \
      the actual tag instead of the discovered tag, this entry can be omitted.'
  },
  wizardDescription1: {
    id: 'ContainerImagesPrepareForm.wizardDescription1',
    defaultMessage:
      'Container images need to be pulled from an image registry which is \
      reliably available to overcloud nodes. The three common options to serve \
      images are to use the default registry, the registry available on the \
      undercloud, or an independently managed registry.'
  },
  wizardDescription2: {
    id: 'ContainerImagesPrepareForm.wizardDescription2',
    defaultMessage:
      'This dialog is used to specify any desired behaviour, including:'
  },
  wizardDescription2_1: {
    id: 'ContainerImagesPrepareForm.wizardDescription2_1',
    defaultMessage: 'Where to pull images from'
  },
  wizardDescription2_2: {
    id: 'ContainerImagesPrepareForm.wizardDescription2_2',
    defaultMessage: 'Which local repository to push images to'
  },
  wizardDescription2_3: {
    id: 'ContainerImagesPrepareForm.wizardDescription2_3',
    defaultMessage: 'How to discover the last versioned tag for each image'
  },
  wizardDescription3: {
    id: 'ContainerImagesPrepareForm.wizardDescription3',
    defaultMessage:
      'All parameters are optional. Defaults will be used when no value is provided.'
  }
});

const ContainerImagesPrepareForm = ({
  error,
  intl: { formatMessage },
  submitting,
  handleSubmit
}) => (
  <Form onSubmit={handleSubmit} horizontal>
    <OverlayLoader
      loaded={!submitting}
      content={formatMessage(messages.generatingConfiguration)}
    >
      <Wizard.Row>
        <Wizard.Main>
          <Wizard.Contents key={1} stepIndex={0} activeStepIndex={0}>
            <p>
              <small>
                <FormattedMessage {...messages.wizardDescription1} />
              </small>
            </p>
            <p>
              <small>
                <FormattedMessage {...messages.wizardDescription2} />
              </small>
            </p>
            <small>
              <ul>
                <li>
                  <FormattedMessage {...messages.wizardDescription2_1} />
                </li>
                <li>
                  <FormattedMessage {...messages.wizardDescription2_2} />
                </li>
                <li>
                  <FormattedMessage {...messages.wizardDescription2_3} />
                </li>
              </ul>
            </small>
            <p>
              <small>
                <FormattedMessage {...messages.wizardDescription3} />{' '}
              </small>
            </p>
            <br />
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
                validate={[
                  format({
                    with: FQDN_REGEX,
                    message: formatMessage(messages.namespaceInvalid),
                    allowBlank: true
                  })
                ]}
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
                      content={formatMessage(messages.namePrefixDescription)}
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
                      content={formatMessage(messages.nameSuffixDescription)}
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
                      content={formatMessage(messages.tagFromLabelDescription, {
                        labelExample: '{version}-{release}'
                      })}
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
ContainerImagesPrepareForm.propTypes = {
  error: PropTypes.object,
  handleSubmit: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  submitting: PropTypes.bool.isRequired
};

const form = reduxForm({
  form: 'containerImagesPrepareForm',
  onSubmit: (values, dispatch, props) => {
    dispatch(startContainerImagesPrepare(values));
  }
});

export default injectIntl(form(ContainerImagesPrepareForm));
