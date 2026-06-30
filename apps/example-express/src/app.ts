import express from "express";

import { AuditAction, AuditStatus, type AuditEvent } from "@auditx/contracts";
import { AuditX } from "@auditx/core";
import { PostgresAdapter } from "@auditx/postgres";

const app = express();

app.use(express.json());

const audit = new AuditX({
  application: {
    name: "example-express",
    version: "0.1.0",
    environment: "development",
  },
  adapters: [
    new PostgresAdapter({
      connection: {
        host: "localhost",
        port: 5460,
        database: "auditx",
        user: "postgres",
        password: "postgres",
      },
      schema: "public",
      table: "audit_logs",
    }),
  ],
});

app.get("/", async (_req, res) => {
  const event: AuditEvent = {
    timestamp: new Date(),

    action: AuditAction.READ,

    resource: {
      id: "health",
      type: "system",
    },

    actor: {
      id: "system",
      name: "Example Application",
    },

    request: {
      method: "GET",
      endpoint: "/",
    },

    state: {
      before: null,
      after: {
        status: "running",
      },
    },

    metadata: {
      source: "example-express",
    },

    status: AuditStatus.SUCCESS,
  };

  await audit.log(event);

  res.json({
    name: "AuditX",
    version: "0.1.0",
    status: "running",
  });
});

export { app };
