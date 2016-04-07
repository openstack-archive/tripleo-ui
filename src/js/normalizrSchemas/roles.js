import { Schema } from 'normalizr';

export const roleSchema = new Schema('roles', { idAttribute: 'name' });
