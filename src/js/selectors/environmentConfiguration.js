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
import { List } from 'immutable';

const topics = state => state.environmentConfiguration.topics;
const environmentGroups = state =>
  state.environmentConfiguration.environmentGroups;
export const getEnvironments = state =>
  state.environmentConfiguration.environments.sortBy(e =>
    e.title.toLowerCase()
  );

export const getEnvironment = (state, environmentFileName) =>
  state.environmentConfiguration.environments.get(environmentFileName);

export const getEnabledEnvironments = createSelector(
  getEnvironments,
  environments => {
    return environments.filter(environment => environment.get('enabled'));
  }
);

export const getEnvironmentConfigurationSummary = createSelector(
  getEnabledEnvironments,
  environments => {
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
  [topics, environmentGroups, getEnvironments],
  (topics, environmentGroups, environments) => {
    return topics.map(topic => {
      return topic.update('environment_groups', envGroups => {
        return envGroups.map(envGroup => {
          return environmentGroups
            .get(envGroup)
            .update('environments', envs => {
              return environments.filter((p, k) => envs.includes(k));
            });
        });
      });
    });
  }
);
