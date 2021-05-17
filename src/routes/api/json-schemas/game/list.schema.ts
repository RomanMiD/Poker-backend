import { JSONSchema7 } from 'json-schema';


export const listQuerySchema:JSONSchema7={
  additionalProperties: false,
  type: 'object',
  properties: {
    skip: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
    limit: {
      type: 'string',
      pattern: '^[0-9]+$'
    },
  }
}
