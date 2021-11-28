export default {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 6 },
    dueDate: { type: 'string' }
  },
  required: ['name', 'dueDate'],
  additionalProperties: false
} as const;
