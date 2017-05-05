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

export const topicSchema = new Schema('topics', { idAttribute: 'title' });
export const environmentGroupSchema
  = new Schema('environmentGroups',
               { idAttribute: (entity) => entity.title ? entity.title : entity.description });
export const environmentSchema = new Schema('environments', { idAttribute: 'file' });

topicSchema.define({
  environment_groups: arrayOf(environmentGroupSchema)
});

environmentGroupSchema.define({
  environments: arrayOf(environmentSchema)
});
