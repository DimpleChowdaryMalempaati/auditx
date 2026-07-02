import express from "express";

import { AuditAction } from "@auditx/contracts";
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

app.use(
  createAuditMiddleware(audit, {
    exclude: ["/", "/favicon.ico"],
    methods: ["POST", "PUT", "PATCH", "DELETE"],
  }),
);

app.get("/", (_req, res) => {
  res.json({
    name: "AuditX",
    version: "0.1.0",
    status: "running",
  });
});

app.post("/users", (_req, res) => {
  res.status(201).json({
    message: "User created",
  });
});

app.patch("/users/:id", (req, res) => {
  const before = {
    id: req.params.id,
    name: "John Doe",
    email: "john@example.com",
  };

  const after = {
    id: req.params.id,
    name: req.body.name ?? "John Doe",
    email: req.body.email ?? "john@example.com",
  };

  req.audit
    .resource({
      type: "User",
      id: req.params.id,
    })
    .state({
      before,
      after,
    })
    .metadata({
      module: "Users",
      reason: "Profile updated",
    });

  res.json(after);
});

app.delete("/users/:id", (req, res) => {
  req.audit.resource({
    type: "User",
    id: req.params.id,
  });

  res.json({
    id: req.params.id,
    message: "User deleted",
  });
});

app.post("/login", (req, res) => {
  req.audit.action(AuditAction.LOGIN);

  res.json({
    success: true,
  });
});

export { app };
