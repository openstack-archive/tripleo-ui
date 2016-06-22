import { createSelector } from 'reselect';

import { currentPlanNameSelector } from './plans';

const validations = (state) => state.validations.get('validations');
const executions = (state) => state.executions.get('executions');

/**
 * Filter workflow executions only to validations and current plan
 */
export const getValidationExecutionsForCurrentPlan = createSelector(
  [executions, currentPlanNameSelector], (executions, currentPlanName) => {
    return executions.filter(execution =>
      execution.get('workflow_name') === 'tripleo.validations.v1.run_and_notify' &&
      execution.getIn(['input', 'plan']) === currentPlanName);
  }
);

/**
 * Adds map of validation results to each validation
 */
export const getValidationsWithResults = createSelector(
  [validations, getValidationExecutionsForCurrentPlan], (validations, results) => {
    return validations.map(validation => {
      return validation.set('results', getValidationResults(validation.id, results));
    });
  }
);

/**
 * Helper function to get a validation results by validation name and order them by updated_at
 */
const getValidationResults = (validationId, results) => {
  return results.filter(result => result.getIn(['input', 'validation_name']) === validationId)
                .sortBy(result => result.get('updated_at'));
};
