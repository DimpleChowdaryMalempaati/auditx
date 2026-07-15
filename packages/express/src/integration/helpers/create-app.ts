import express from "express";

import { AuditAction } from "@auditx/contracts";
import type { AuditX } from "@auditx/core";

import { createAuditMiddleware } from "../../middleware/create-audit-middleware";
import type { AuditMiddlewareOptions } from "../../types/audit-middleware-options";

export function createApp(audit: AuditX, options: AuditMiddlewareOptions = {}) {
  const app = express();

  app.use(express.json());

  app.use(createAuditMiddleware(audit, options));

  app.patch("/users/:id", (req, res) => {
    req.audit
      .action(AuditAction.UPDATE)
      .resource({
        type: "User",
        id: req.params.id,
      })
      .metadata({
        module: "Users",
      });

    res.status(200).json({
      success: true,
    });
  });

  app.get("/health", (_req, res) => {
    res.json({
      status: "ok",
    });
  });

  return app;
}
