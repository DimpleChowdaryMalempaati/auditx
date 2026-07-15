# @auditx/postgres

PostgreSQL adapter for AuditX.

## Features

- PostgreSQL persistence for AuditX
- Automatic schema creation
- Automatic audit table creation
- Parameterized SQL queries
- JSONB support for structured audit data
- SQL identifier validation

## Installation

```bash
npm install @auditx/postgres
```

## Usage

```ts
import { AuditX } from "@auditx/core";
import { PostgresAdapter } from "@auditx/postgres";

const audit = new AuditX({
  application: {
    name: "example-app",
    version: "1.0.0",
    environment: "development",
  },

  adapters: [
    new PostgresAdapter({
      connection: {
        host: "localhost",
        port: 5432,
        database: "auditx",
        user: "postgres",
        password: "postgres",
      },

      schema: "public",
      table: "audit_logs",
    }),
  ],
});
```

## Database

The adapter automatically creates the configured schema (if it does not exist) and creates the audit table on first use.

The audit table stores:

- Audit event metadata
- Actor information
- Resource information
- Request information
- Before state
- After state
- Custom metadata
- Audit status
- Timestamps

## Requirements

- PostgreSQL 14+
- Node.js 20+
- AuditX Core

## License

MIT
