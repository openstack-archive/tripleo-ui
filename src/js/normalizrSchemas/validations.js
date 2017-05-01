import { Schema } from 'normalizr';

// export const validationStageSchema = new Schema('validationStages', { idAttribute: 'uuid' });
// export const validationSchema = new Schema('validations', { idAttribute: 'uuid' });
// export const validationResultSchema = new Schema('validationResults', { idAttribute: 'uuid' });
//
// validationStageSchema.define({
//   validations: arrayOf(validationSchema)
// });
//
// validationSchema.define({
//   latest_result: validationResultSchema
// });

export const validationSchema = new Schema('validations', {
  idAttribute: 'id'
});
