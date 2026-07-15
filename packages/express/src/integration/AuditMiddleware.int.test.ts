import express from "express";
import request from "supertest";

import { describe, expect, it, vi } from "vitest";

import { AuditAction, type TransportContext } from "@auditx/contracts";
import { AuditX } from "@auditx/core";

import { createAuditMiddleware } from "../middleware/create-audit-middleware";

describe("AuditMiddleware Integration", () => {
  it("builds and captures a transport context", async () => {
    let capturedContext: TransportContext | undefined;

    const audit = {
      capture: vi.fn(async (context: TransportContext) => {
        capturedContext = context;
      }),
    } as unknown as AuditX;

    const app = express();

    app.use(express.json());

    app.use(createAuditMiddleware(audit));

    app.patch("/users/:id", (req, res) => {
      expect(req.audit).toBeDefined();

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

    await request(app)
      .patch("/users/123")
      .set("User-Agent", "Vitest")
      .set("X-Request-Id", "request-123")
      .send({
        name: "Jane",
      })
      .expect(200);

    // Wait for the asynchronous audit capture
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(capturedContext).toBeDefined();

    const context = capturedContext!;

    expect(context.request.method).toBe("PATCH");
    expect(context.request.endpoint).toBe("/users/123");
    expect(context.request.body).toEqual({
      name: "Jane",
    });

    expect(context.request.userAgent).toBe("Vitest");
    expect(context.request.requestId).toBe("request-123");

    expect(context.response.statusCode).toBe(200);

    expect(context.auditContext).toBeDefined();

    const auditContext = context.auditContext!;

    expect(auditContext.action).toBe(AuditAction.UPDATE);

    expect(auditContext.resource).toEqual({
      type: "User",
      id: "123",
    });

    expect(auditContext.metadata).toEqual({
      module: "Users",
    });
  });
});
