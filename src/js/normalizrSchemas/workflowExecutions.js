import { Schema } from 'normalizr';

export const workflowExecutionSchema = new Schema('executions', {
  idAttribute: 'id'
});
