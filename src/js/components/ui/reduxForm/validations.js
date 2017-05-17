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

import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  maxValue: {
    id: 'reduxForm.validations.maxValue',
    defaultMessage: 'Maximum value is {max, number}.'
  },
  minValue: {
    id: 'reduxForm.validations.minValue',
    defaultMessage: 'Minimum value is {min, number}.'
  },
  number: {
    id: 'reduxForm.validations.number',
    defaultMessage: 'Value needs to be a number.'
  }
});

export const minValue = (min, message) => value =>
  value && value < min ? message : undefined;

export const maxValue = (max, message) => value =>
  value && value > max ? message : undefined;

export const number = message => value =>
  value && isNaN(Number(value)) ? message : undefined;
