import { JSONSchema7 } from 'json-schema';

export const findQuerySchema: JSONSchema7 = {

  type: 'object',
  additionalProperties: false,
  properties: {
    skip: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    limit: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    query: {
      type: 'string',
      minLength: 2,
      maxLength: 100
    }
  },
  required: ['query']
}
