import { createSelector } from 'reselect';

import { currentPlanNameSelector } from './plans';
import { getFilterByName } from './filters';
import MistralConstants from '../constants/MistralConstants';

const validations = (state) => state.validations.get('validations');
const executions = (state) => state.executions.get('executions');
const validationsToolbarFilter = state => getFilterByName(state, 'validationsToolbar');

/**
 * Filter workflow executions only to validations and current plan
 */
export const getValidationExecutionsForCurrentPlan = createSelector(
  [executions, currentPlanNameSelector], (executions, currentPlanName) => {
    return executions.filter(execution =>
      execution.get('workflow_name') === MistralConstants.VALIDATIONS_RUN &&
      execution.getIn(['input', 'plan']) === currentPlanName);
  }
);

/**
 * Adds map of validation results to each validation
 */
export const getValidationsWithResults = createSelector(
  [validations, getValidationExecutionsForCurrentPlan], (validations, results) => {
    return validations.map(validation => {
      const validationResults = getValidationResults(validation.id, results);
      return validation.set('results', validationResults)
                       .set('status', getValidationStatus(validationResults));
    });
  }
);

/**
 * Filter validations using the active Toolbar filters
 */
export const getFilteredValidations = createSelector(
  [getValidationsWithResults, validationsToolbarFilter],
  (validations, validationsToolbarFilter) => {
    const activeFilters = validationsToolbarFilter.get('activeFilters');
    return activeFilters.reduce((filteredValidations, filter) =>
      filteredValidations.filter((validation) => {
        switch(filter.filterBy) {
        case 'name':
          return validation.name.toLowerCase().includes(filter.filterString.toLowerCase());
        case 'group': {
          return validation.groups.reduce((result, group) => result
            ? result : group.toLowerCase().includes(filter.filterString.toLowerCase()) , false);
        }
        default:
          return false;
        }
      }), validations)
      .sortBy(validation => validation.getIn(validationsToolbarFilter.get('sortBy').split('.')))
      .update(validations => validationsToolbarFilter.get('sortDir') === 'desc'
        ? validations.reverse()
        : validations);
  }
);

/**
 * Helper function to get a validation results by validation name
 */
const getValidationResults = (validationId, results) => {
  return results.filter(result => result.getIn(['input', 'validation_name']) === validationId);
};

/**
 * Helper function to determine validation status based on validation's results
 */
const getValidationStatus = (validationResults) => {
  switch (true) {
  case (validationResults.isEmpty()):
    return 'new';
  case (validationResults.last().state === 'RUNNING'):
    return 'running';
  case (validationResults.last().output.get('status') === 'SUCCESS'):
    return 'success';
  case (validationResults.last().output.get('status') === 'FAILED'):
    return 'failed';
  case (validationResults.last().state === 'PAUSED'):
    return 'paused';
  default:
    return 'error';
  }
};


/**
 * Selects pre deployment validations
 */
export const getPreDeploymentValidationsWithResults = createSelector(
  getValidationsWithResults, validations => {
    const preDeploymentValidationGroups = ['pre-deployment', 'pre', 'pre-introspection'];
    return validations.filter(validation =>
      !validation.groups.toSet().intersect(preDeploymentValidationGroups).isEmpty());
  }
);


/**
 * Provides aggregate counts of pre-deployment validations by their status
 */
export const getPreDeploymentValidationsStatusCounts = createSelector(
  getPreDeploymentValidationsWithResults, validations =>
    validations.countBy(validation => validation.status)
);

/**
 * Provides aggregate counts of pre-deployment validations by their status
 */
export const allPreDeploymentValidationsSuccessful = createSelector(
  getPreDeploymentValidationsStatusCounts, counts =>
    counts.keySeq().toSet().intersect(['new', 'running', 'failed', 'paused', 'error']).isEmpty()
);
