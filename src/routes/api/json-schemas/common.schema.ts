import { JSONSchema7 } from 'json-schema';

export const emailSchema: JSONSchema7 = {
  type: 'string',
  pattern: '^[^@]+@[^@]+\\.[^@]+$',
  format: 'email',
  maxLength: 100,
}
