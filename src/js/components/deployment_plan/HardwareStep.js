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

import { defineMessages, FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import React from 'react';

const messages = defineMessages({
  registerNodes: {
    id: 'HardwareStep.registerNodes',
    defaultMessage: 'Register Nodes'
  }
});

const HardwareStep = () => {
  return (
    <Link className="btn btn-default" to="/nodes/register">
      <span className="fa fa-plus" />&nbsp;
      <FormattedMessage {...messages.registerNodes} />
    </Link>
  );
};

export default HardwareStep;
