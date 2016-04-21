import { createSelector } from 'reselect';
import { List } from 'immutable';

const topics = state => state.environmentConfiguration.topics;
const environmentGroups = state => state.environmentConfiguration.environmentGroups;
const environments = state => state.environmentConfiguration.environments;

export const getEnabledEnvironments = createSelector(
  environments, (environments) => {
    return environments.filter( environment => environment.get('enabled') );
  }
);

export const getEnvironmentConfigurationSummary = createSelector(
  getEnabledEnvironments, (environments) => {
    const titlesList = environments.reduce((titlesList, environment) => {
      return titlesList.push(environment.get('title'));
    }, List());
    return titlesList.toArray().join(', ');
  }
);

/**
 * Returns Map of Topics with nested Environment Groups and Environments
 */
export const getTopicsTree = createSelector(
  [topics, environmentGroups, environments],
  (topics, environmentGroups, environments) => {
    return topics.map(topic => {
      return topic.update('environment_groups', envGroups => {
        return envGroups.map(envGroup => {
          return environmentGroups.get(envGroup).update('environments', envs => {
            return envs.map(environment => environments.get(environment));
          });
        });
      });
    });
  }
);
