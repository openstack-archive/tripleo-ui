import { Schema, arrayOf } from 'normalizr';

export const topicSchema = new Schema('topics', { idAttribute: 'title' });
export const environmentGroupSchema
  = new Schema('environmentGroups',
               { idAttribute: (entity) => entity.title ? entity.title : entity.description });
export const environmentSchema = new Schema('environments', { idAttribute: 'file' });

topicSchema.define({
  environment_groups: arrayOf(environmentGroupSchema)
});

environmentGroupSchema.define({
  environments: arrayOf(environmentSchema)
});
