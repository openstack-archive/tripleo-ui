import { Schema } from 'normalizr';

export const nodeSchema = new Schema('nodes', { idAttribute: 'uuid' });
export const portSchema = new Schema('ports', { idAttribute: 'uuid' });
