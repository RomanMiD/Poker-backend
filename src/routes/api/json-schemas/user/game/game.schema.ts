import { JSONSchema7 } from "json-schema";


export const newGameBodySchema: JSONSchema7 = {
  type: "object",
  additionalProperties: false,
  required: ["roomName", "description", "stories"],
  properties: {
    roomName: {
      type: "string",
      minLength: 3,
      maxLength: 40,
    },
    description: {
      type: "string",
      minLength: 3,
      maxLength: 150,
    },
    stories: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "body", "position"],
        properties: {
          title: {
            type: "string"
          },
          body: {
            type: "string"
          },
          position: {
            type: "number"
          }
        }
      }
    }
  }
}
