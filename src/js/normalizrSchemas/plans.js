import { Schema } from 'normalizr';

export const planFileSchema = new Schema('planFiles', { idAttribute: 'name' });
