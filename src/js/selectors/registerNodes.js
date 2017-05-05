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

import { createSelector } from 'reselect';

import { IronicNode } from '../immutableRecords/nodes';

const nodesToRegister = state => state.registerNodes.get('nodesToRegister');

/**
 * Returns true if there are any nodes to register and all of them are valid
 * @return boolean
 */
export const allNodesToRegisterAreValid = createSelector(
  nodesToRegister,
  nodesToRegister => {
    return (
      nodesToRegister.every(node => node.valid) && !nodesToRegister.isEmpty()
    );
  }
);

/**
 * Converts nodesToRegister to map of nodes comsumable by register workflow
 * @return OrderedMap of IronicNodes
 */
export const getIronicNodesfromNodesToRegister = createSelector(
  nodesToRegister,
  nodesToRegister => {
    return nodesToRegister.map(node => new IronicNode(node));
  }
);
