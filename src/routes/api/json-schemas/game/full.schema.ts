import { JSONSchema7 } from 'json-schema';

export const fullGameParamsSchema: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  properties: {
    id: {
      type: 'string',
      minLength: 24,
      maxLength: 24,
    },
  },
  required: ['id']
}
