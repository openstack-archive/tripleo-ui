import { Schema, arrayOf } from 'normalizr';

export const resourceGroupSchema = new Schema('resources', { idAttribute: 'uuid' });
export const parameterSchema = new Schema('parameters', { idAttribute: 'uuid' });

resourceGroupSchema.define({
  NestedParameters: arrayOf(resourceGroupSchema),
  Parameters: arrayOf(parameterSchema)
});
