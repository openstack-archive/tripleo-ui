import { Schema } from 'normalizr';

export const stackSchema = new Schema('stacks', { idAttribute: 'stack_name' });
export const stackResourceSchema = new Schema('stackResources', { idAttribute: 'resource_name' });
