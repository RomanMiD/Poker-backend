import { JSONSchema7 } from 'json-schema';
import { emailSchema } from '../common.schema';


export const registrationBodySchema: JSONSchema7 = {
  type: 'object',
  additionalProperties: false,
  required: ['email', 'password', 'name'],
  properties: {
    email: emailSchema,
    password: {
      type: 'string',
      minLength: 6,
      maxLength: 50,
    },
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 30,
    },
  },
}
