import { createSelector } from 'reselect';

const nodes = state => state.nodes.get('all');

export const getRegisteredNodes = createSelector(
  nodes, (nodes) => {
    return nodes.filter( node => node.get('provision_state') === 'available' &&
                                 !node.get('provision_updated_at') ||
                                 node.get('provision_state') === 'manageable' );
  }
);

export const getIntrospectedNodes = createSelector(
  nodes, (nodes) => {
    return nodes.filter( node => node.get('provision_state') === 'available' &&
                                 !!node.get('provision_updated_at') );
  }
);

export const getProvisionedNodes = createSelector(
  nodes, (nodes) => {
    return nodes.filter( node => node.get('instance_uuid') );
  }
);

export const getMaintenanceNodes = createSelector(
  nodes, (nodes) => {
    return nodes.filter( node => node.get('maintenance') );
  }
);

export const getUnassignedIntrospectedNodes = createSelector(
  getIntrospectedNodes, (introspectedNodes) => {
    return introspectedNodes.filterNot(
      node => node.getIn(['properties', 'capabilities']).match(/.*profile:.+(,|$)/)
    );
  }
);
