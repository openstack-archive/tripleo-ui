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
      execution.get('workflow_name') === 'tripleo.validations.v1.run_validation' &&
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
