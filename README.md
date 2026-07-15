# AuditX

> Enterprise-grade, framework-agnostic audit logging for Node.js applications.

AuditX is a modular audit logging framework that automatically captures audit events from your application without requiring audit logging code throughout your business logic.

Designed for enterprise applications, AuditX provides automatic request auditing, extensible adapters, request-scoped audit context, and structured audit events.

---

## Features

- 🚀 Automatic audit logging middleware
- 🔒 Request-scoped audit context
- 👤 Actor resolution support
- 📦 Framework-agnostic core
- 🌐 Express middleware
- 🗄 PostgreSQL adapter
- 🔌 Adapter-based architecture
- 📋 Before/After state tracking
- 🏷 Resource metadata
- ⚡ TypeScript first
- ✅ Unit tested
- 🐳 Docker friendly

---

## Project Structure

```
auditx
│
├── apps
│   └── example-express
│
├── packages
│   ├── contracts
│   ├── core
│   ├── express
│   └── postgres
│
└── tooling
```

---

## Architecture

```
HTTP Request
      │
      ▼
Express Middleware
      │
      ▼
RequestAuditBuilder
      │
      ▼
AuditX
      │
      ▼
AuditEventMapper
      │
      ▼
AuditEngine
      │
      ▼
AuditAdapter
      │
      ▼
PostgreSQL
```

---

## Installation

```bash
npm install @auditx/core
npm install @auditx/express
npm install @auditx/postgres
```

---

## Quick Start

```ts
import express from "express";

import { AuditX } from "@auditx/core";
import { createAuditMiddleware } from "@auditx/express";
import { PostgresAdapter } from "@auditx/postgres";

const audit = new AuditX({
  application: {
    name: "my-app",
    version: "1.0.0",
    environment: "production",
  },
  adapters: [
    new PostgresAdapter({
      connection: {
        host: "localhost",
        port: 5432,
        database: "audit",
        user: "postgres",
        password: "postgres",
      },
    }),
  ],
});

const app = express();

app.use(express.json());

app.use(createAuditMiddleware(audit));
```

---

## Enriching Audit Events

Inside your route:

```ts
req.audit
  .resource({
    type: "User",
    id: user.id,
  })
  .state({
    before,
    after,
  })
  .metadata({
    module: "Users",
    reason: "Profile updated",
  });
```

AuditX automatically combines this information with request metadata before persisting the audit event.

---

## Example Audit Record

```json
{
  "action": "UPDATE",
  "resource": {
    "type": "User",
    "id": "1"
  },
  "status": "SUCCESS",
  "metadata": {
    "module": "Users",
    "application": {
      "name": "example-express",
      "version": "0.1.0",
      "environment": "development"
    }
  }
}
```

---

## Packages

| Package             | Description                 |
| ------------------- | --------------------------- |
| `@auditx/contracts` | Shared interfaces and types |
| `@auditx/core`      | Audit engine                |
| `@auditx/express`   | Express middleware          |
| `@auditx/postgres`  | PostgreSQL adapter          |

---

## Roadmap

### v0.1

- Core framework
- Express middleware
- PostgreSQL adapter
- Example application
- Unit tests

### v0.2

- Fastify support
- NestJS support
- MongoDB adapter
- MySQL adapter
- OpenTelemetry integration

---

## Contributing

Contributions are welcome.

Please open an issue before submitting large feature changes.

---

## License

MIT
