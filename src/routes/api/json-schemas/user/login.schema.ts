import { JSONSchema7 } from 'json-schema';


export const loginBodySchema: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['email', 'password'],
  properties: {
    password: {
      type: 'string',
      minLength: 6,
      maxLength: 50,
    },
    email: {
      type: 'string',
      pattern: '^[^@]+@[^@]+\\.[^@]+$',
      format: 'email',
      maxLength:100,
    }
  }
}
