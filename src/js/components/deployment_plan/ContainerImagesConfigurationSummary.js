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

const messages = defineMessages({
  editConfigurationLink: {
    id: 'ConfigureContainerImagesStep.editConfigurationLink',
    defaultMessage: 'Edit Configuration'
  },
  loadingImagesConfiguration: {
    id: 'ConfigureContainerImagesStep.loadingImagesConfiguration',
    defaultMessage: 'Loading images configuration...'
  },
  namespaceLabel: {
    id: 'ContainerImagesConfigurationSummary.namespaceLabel',
    defaultMessage: 'Image Template'
  },
  tagFromLabelLabel: {
    id: 'ContainerImagesConfigurationSummary.tagFromLabelLabel',
    defaultMessage: 'Tag from Label'
  },
  pushDestinationLabel: {
    id: 'ContainerImagesConfigurationSummary.pushDestinationLabel',
    defaultMessage: 'Push Destination'
  },
  pushDestinationUndercloud: {
    id: 'ContainerImagesConfigurationSummary.pushDestinationUndercloud',
    defaultMessage: 'Undercloud image registry'
  },
  containerImagesNotConfiguredYet: {
    id: 'ContainerImagesConfigurationSummary.containerImagesNotConfiguredYet',
    defaultMessage: 'Container images are not configured yet'
  }
});

const ContainerImagesConfigurationSummary = ({
  containerImagePrepareParameterSeed,
  intl: { formatMessage }
}) => {
  if (Object.keys(containerImagePrepareParameterSeed).length > 0) {
    const {
      push_destination,
      tag_from_label,
      namespace,
      name_prefix,
      name_suffix,
      tag
    } = containerImagePrepareParameterSeed;
    return (
      <dl className="dl-horizontal">
        {namespace && (
          <Fragment>
            <dt>
              <FormattedMessage {...messages.namespaceLabel} />
            </dt>
            <dd>{`${namespace}/${name_prefix &&
              name_prefix}<IMAGE-NAME>${name_suffix && name_suffix}${tag &&
              ':' + tag}`}</dd>
          </Fragment>
        )}
        {push_destination && (
          <Fragment>
            <dt>
              <FormattedMessage {...messages.pushDestinationLabel} />
            </dt>
            <dd>
              {push_destination === true
                ? formatMessage(messages.pushDestinationUndercloud)
                : push_destination}
            </dd>
          </Fragment>
        )}
        {tag_from_label && (
          <Fragment>
            <dt>
              <FormattedMessage {...messages.tagFromLabelLabel} />
            </dt>
            <dd>{tag_from_label}</dd>
          </Fragment>
        )}
      </dl>
    );
  } else {
    return (
      <p>
        <FormattedMessage {...messages.containerImagesNotConfiguredYet} />
      </p>
    );
  }
};
ContainerImagesConfigurationSummary.propTypes = {
  containerImagePrepareParameterSeed: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired
};

export default injectIntl(ContainerImagesConfigurationSummary);
