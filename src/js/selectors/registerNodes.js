import { createSelector } from 'reselect';

import { IronicNode } from '../immutableRecords/nodes';

const nodesToRegister = state => state.registerNodes.get('nodesToRegister');

/**
 * Returns true if there are any nodes to register and all of them are valid
 * @return boolean
 */
export const allNodesToRegisterAreValid = createSelector(
  nodesToRegister, (nodesToRegister) => {
    return nodesToRegister.every(node => node.valid) && !nodesToRegister.isEmpty();
  }
);

/**
 * Converts nodesToRegister to map of nodes comsumable by register workflow
 * @return OrderedMap of IronicNodes
 */
export const getIronicNodesfromNodesToRegister = createSelector(
  nodesToRegister, (nodesToRegister) => {
    return nodesToRegister.map(node => new IronicNode(node));
  }
);
