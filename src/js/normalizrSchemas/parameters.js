import { Schema, arrayOf } from 'normalizr';

// const generateParameterName = entity => {
//   console.log(entity.name);
//   return entity.name;
// };
// export const parameterSchema = new Schema('parameters', { idAttribute: generateParameterName });

export const resourceGroupSchema = new Schema('resources', { idAttribute: 'id' });
export const parameterSchema = new Schema('parameters', { idAttribute: 'name' });

resourceGroupSchema.define({
  nestedParameters: arrayOf(resourceGroupSchema),
  parameters: arrayOf(parameterSchema)
});
