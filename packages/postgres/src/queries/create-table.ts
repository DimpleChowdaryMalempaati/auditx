import { validateIdentifier } from "../utils/validate-identifier";

export function createTableQuery(
  schema: string,
  table: string
): string {
  const safeSchema = validateIdentifier(schema);
  const safeTable = validateIdentifier(table);

  return `
    CREATE SCHEMA IF NOT EXISTS ${safeSchema};

    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    CREATE TABLE IF NOT EXISTS ${safeSchema}.${safeTable} (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

      action VARCHAR(100) NOT NULL,

      actor JSONB,

      resource JSONB,

      request JSONB,

      before_state JSONB,

      after_state JSONB,

      metadata JSONB,

      status VARCHAR(20),

      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;
}