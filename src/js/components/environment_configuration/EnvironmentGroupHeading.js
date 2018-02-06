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

import PropTypes from 'prop-types';
import React from 'react';

const EnvironmentGroupHeading = ({ title, description }) => {
  if (title) {
    return (
      <h4>
        {title}
        <br />
        <small>{description}</small>
      </h4>
    );
  } else if (description) {
    return <p>{description}</p>;
  } else {
    return false;
  }
};
EnvironmentGroupHeading.propTypes = {
  description: PropTypes.string,
  title: PropTypes.string
};

export default EnvironmentGroupHeading;
