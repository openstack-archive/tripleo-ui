import { Schema } from 'normalizr';

export const stackResourceSchema = new Schema('stackResources', { idAttribute: 'resource_name' });
