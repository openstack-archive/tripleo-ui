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

import { getCurrentPlanName } from './plans';
import { getFilterByName } from './filters';
import MistralConstants from '../constants/MistralConstants';

const validations = state => state.validations.get('validations');
const executions = state => state.executions.get('executions');
const validationsToolbarFilter = state =>
  getFilterByName(state, 'validationsToolbar');

/**
 * Filter workflow executions only to validations and current plan
 */
export const getValidationExecutionsForCurrentPlan = createSelector(
  [executions, getCurrentPlanName],
  (executions, currentPlanName) => {
    const mostRecentPlanUpdate = getMostRecentPlanUpdate(
      executions,
      currentPlanName
    );
    return executions.filter(
      execution =>
        execution.get('workflow_name') === MistralConstants.VALIDATIONS_RUN &&
        execution.getIn(['input', 'plan']) === currentPlanName &&
        execution.get('updated_at') > mostRecentPlanUpdate
    );
  }
);

/**
 * Adds map of validation results to each validation
 */
export const getValidationsWithResults = createSelector(
  [validations, getValidationExecutionsForCurrentPlan],
  (validations, results) => {
    return validations.map(validation => {
      const validationResults = getValidationResults(validation.id, results);
      return validation
        .set('results', validationResults)
        .set('status', getValidationStatus(validationResults));
    });
  }
);

/**
 * Filter validations using the active Toolbar filters.
 * Only include validations younger than the most recent update to a plan.
 */
export const getFilteredValidations = createSelector(
  [getValidationsWithResults, validationsToolbarFilter],
  (validations, validationsToolbarFilter) => {
    const activeFilters = validationsToolbarFilter.get('activeFilters');
    return activeFilters
      .reduce(
        (filteredValidations, filter) =>
          filteredValidations.filter(validation => {
            switch (filter.filterBy) {
              case 'name':
                return validation.name
                  .toLowerCase()
                  .includes(filter.filterString.toLowerCase());
              case 'group': {
                return validation.groups.reduce(
                  (result, group) =>
                    result
                      ? result
                      : group
                          .toLowerCase()
                          .includes(filter.filterString.toLowerCase()),
                  false
                );
              }
              default:
                return false;
            }
          }),
        validations
      )
      .sortBy(validation =>
        validation.getIn(validationsToolbarFilter.get('sortBy').split('.'))
      )
      .update(
        validations =>
          validationsToolbarFilter.get('sortDir') === 'desc'
            ? validations.reverse()
            : validations
      );
  }
);

export const getValidationStatusCounts = createSelector(
  [getValidationsWithResults],
  validations => validations.countBy(v => v.status).sortBy((v, k) => k)
);

/**
 * Helper function to get the most recent time a plan has been updated or
 * created.
 */
export const getMostRecentPlanUpdate = (executions, planName) => {
  return (
    executions
      .filter(
        execution =>
          [MistralConstants.PLAN_UPDATE, MistralConstants.PLAN_CREATE].includes(
            execution.workflow_name
          ) && execution.getIn(['input', 'container']) === planName
      )
      .map(execution => execution.get('updated_at'))
      .sort()
      .last() || 0
  );
};

/**
 * Helper function to get a validation results by validation name
 */
const getValidationResults = (validationId, results) => {
  return results.filter(
    result => result.getIn(['input', 'validation_name']) === validationId
  );
};

/**
 * Helper function to determine validation status based on validation's results
 */
const getValidationStatus = validationResults => {
  switch (true) {
    case validationResults.isEmpty():
      return 'new';
    case validationResults.last().state === 'RUNNING':
      return 'running';
    case validationResults.last().output.get('status') === 'SUCCESS':
      if (
        validationResults
          .last()
          .output.get('stdout', '')
          .includes('Warnings:')
      ) {
        return 'warning';
      }
      return 'success';
    case validationResults.last().output.get('status') === 'FAILED':
      return 'failed';
    case validationResults.last().state === 'PAUSED':
      return 'paused';
    default:
      return 'error';
  }
};

/**
 * Selects pre deployment validations
 */
export const getPreDeploymentValidationsWithResults = createSelector(
  getValidationsWithResults,
  validations => {
    const preDeploymentValidationGroups = [
      'pre-deployment',
      'pre',
      'pre-introspection'
    ];
    return validations.filter(
      validation =>
        !validation.groups
          .toSet()
          .intersect(preDeploymentValidationGroups)
          .isEmpty()
    );
  }
);

/**
 * Provides aggregate counts of pre-deployment validations by their status
 */
export const getPreDeploymentValidationsStatusCounts = createSelector(
  getPreDeploymentValidationsWithResults,
  validations => validations.countBy(validation => validation.status)
);

/**
 * Provides aggregate counts of pre-deployment validations by their status
 */
export const allPreDeploymentValidationsSuccessful = createSelector(
  getPreDeploymentValidationsStatusCounts,
  counts =>
    counts
      .keySeq()
      .toSet()
      .intersect(['new', 'running', 'failed', 'paused', 'error'])
      .isEmpty()
);
