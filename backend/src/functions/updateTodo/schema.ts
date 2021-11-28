export default {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 6 },
    dueDate: { type: 'string' },
    done: { type: 'boolean' }
  },
  required: ['name', 'dueDate', 'done'],
  additionalProperties: false
} as const;
