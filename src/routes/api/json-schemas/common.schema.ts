import { JSONSchema7 } from 'json-schema';

export const emailSchema: JSONSchema7 = {
  type: 'string',
  pattern: '^[^@]+@[^@]+\\.[^@]+$',
  format: 'email',
  maxLength: 100,
}

export const strictBlackSchema: JSONSchema7 = {
  type: 'object',
  additionalProperties: false
}
