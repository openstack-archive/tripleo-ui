import { createSelector } from 'reselect';

const nodes = state => state.nodes.get('all');

export const getRegisteredNodes = createSelector(
  nodes, (nodes) => {
    return nodes.filterNot( node => node.get('provision_state') === 'active' ||
                                    node.get('maintenance') );
  }
);

export const getIntrospectedNodes = createSelector(
  nodes, (nodes) => {
    return nodes.filter( node => node.getIn(['properties', 'memory_mb']) &&
                                 node.getIn('properties', 'cpu_arch') &&
                                 node.getIn('properties', 'cpus') &&
                                 node.getIn('properties', 'local_gb') );
  }
);

export const getDeployedNodes = createSelector(
  nodes, (nodes) => {
    return nodes.filter( node => node.get('provision_state') === 'active' );
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
      node => node.getIn(['properties', 'capabilities']).match(/.*profile:(\w+)/)
    );
  }
);

export const getAssignedNodes = (introspectedNodes, roleName) => {
  return introspectedNodes.filter(
    node => node.getIn(['properties', 'capabilities']).includes(`profile:${roleName}`)
  );
};
