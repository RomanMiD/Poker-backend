import { JSONSchema7 } from 'json-schema';


export const registrationBodySchema: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['email', 'password', 'name'],
  properties: {
    email: {
      type: 'string',
      pattern: '^[^@]+@[^@]+\\.[^@]+$',
      format: 'email',
      maxLength:100,
    },
    password: {
      type: 'string',
      minLength: 6,
      maxLength: 50,
    },
    name:{
      type: 'string',
      minLength:2,
      maxLength:30,
    },
  },
}
