import { AuditX } from "@auditx/core";
import { PostgresAdapter } from "@auditx/postgres";

import type { Pool } from "pg";

export function createAudit(pool: Pool): AuditX {
  return new AuditX({
    application: {
      name: "integration-test",
      version: "1.0.0",
      environment: "test",
    },
    adapters: [
      new PostgresAdapter({
        pool,
        schema: "public",
        table: "audit_logs",
      }),
    ],
  });
}
