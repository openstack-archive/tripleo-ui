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

import { Schema, arrayOf } from 'normalizr';

// const generateParameterName = entity => {
//   console.log(entity.name);
//   return entity.name;
// };
// export const parameterSchema = new Schema('parameters', { idAttribute: generateParameterName });

export const resourceGroupSchema = new Schema('resources', {
  idAttribute: 'id'
});
export const parameterSchema = new Schema('parameters', {
  idAttribute: 'name'
});

resourceGroupSchema.define({
  nestedParameters: arrayOf(resourceGroupSchema),
  parameters: arrayOf(parameterSchema)
});
