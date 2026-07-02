import express from "express";

import { AuditX } from "@auditx/core";
import { createAuditMiddleware } from "@auditx/express";
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

app.use(createAuditMiddleware(audit));

app.get("/", (_req, res) => {
  res.json({
    name: "AuditX",
    version: "0.1.0",
    status: "running",
  });
});

export { app };