import { readFileSync } from 'node:fs'
import path from 'node:path'

import { Ajv, type ValidateFunction } from 'ajv'
import addFormats from 'ajv-formats'

/**
 * Контрактная валидация ответов /v1/cms/* (ADR-021):
 * канон контракта — JSON Schema из platform-contracts (копия в contract/json-schema),
 * CMS не имеет права отдать ответ, не проходящий схему, — лучше 500,
 * чем «почти правильный» JSON, который сайт молча заменит фолбэком.
 */

const ajv = new Ajv({ allErrors: true, strict: false })
addFormats(ajv)

const compiled = new Map<string, ValidateFunction>()

function getValidator(resource: string): ValidateFunction {
  let validator = compiled.get(resource)
  if (!validator) {
    const schemaPath = path.join(process.cwd(), 'contract', 'json-schema', `cms.${resource}.schema.json`)
    const schema = JSON.parse(readFileSync(schemaPath, 'utf8'))
    validator = ajv.compile(schema)
    compiled.set(resource, validator)
  }
  return validator
}

export interface ContractCheck {
  valid: boolean
  errors: string[]
}

export function validateContract(resource: string, data: unknown): ContractCheck {
  const validator = getValidator(resource)
  const valid = validator(data) as boolean
  return {
    valid,
    errors: valid
      ? []
      : (validator.errors ?? []).slice(0, 5).map((e) => `${e.instancePath || '/'} ${e.message ?? ''}`),
  }
}
