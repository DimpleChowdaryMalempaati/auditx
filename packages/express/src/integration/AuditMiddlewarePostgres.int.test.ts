import { afterAll, beforeEach, describe, expect, it } from "vitest";

import request from "supertest";

import { createApp } from "./helpers/create-app";
import { createAudit } from "./helpers/create-audit";
import { createPool } from "./helpers/create-pool";
import { truncateAuditTable } from "./helpers/truncate-audit-table";
import { waitForAudit } from "./helpers/wait-for-audit";

describe("AuditMiddleware + Postgres Integration", () => {
  const pool = createPool();

  const audit = createAudit(pool);

  beforeEach(async () => {
    await truncateAuditTable(pool);
  });

  afterAll(async () => {
    await pool.end();
  });

  it("persists an audit log after an HTTP request", async () => {
    const app = createApp(audit);

    await request(app)
      .patch("/users/123")
      .set("User-Agent", "Vitest")
      .set("X-Request-Id", "request-123")
      .send({
        name: "Jane",
      })
      .expect(200);

    const result = await pool.query(`
      SELECT *
      FROM public.audit_logs
    `);

    expect(result.rowCount).toBe(1);

    const row = result.rows[0];

    expect(row.action).toBe("UPDATE");
    expect(row.status).toBe("SUCCESS");

    expect(row.resource).toEqual({
      type: "User",
      id: "123",
    });

    expect(row.request.method).toBe("PATCH");
    expect(row.request.endpoint).toBe("/users/123");
    expect(row.request.userAgent).toBe("Vitest");
    expect(row.request.requestId).toBe("request-123");

    expect(row.metadata).toEqual({
      module: "Users",
      application: {
        name: "integration-test",
        version: "1.0.0",
        environment: "test",
      },
    });
  });

  it("does not persist audit logs for excluded routes", async () => {
    const app = createApp(audit, {
      exclude: ["/health"],
    });

    await request(app).get("/health").expect(200);

    const result = await pool.query("SELECT * FROM public.audit_logs");

    expect(result.rowCount).toBe(0);
  });

  it("does not persist audit logs for excluded HTTP methods", async () => {
    const app = createApp(audit, {
      methods: ["POST"],
    });

    await request(app)
      .patch("/users/123")
      .send({
        name: "Jane",
      })
      .expect(200);

    const result = await pool.query("SELECT * FROM public.audit_logs");

    expect(result.rowCount).toBe(0);
  });

  it("only persists audit logs for included routes", async () => {
    const app = createApp(audit, {
      include: ["/users"],
    });

    await request(app)
      .patch("/users/123")
      .send({
        name: "Jane",
      })
      .expect(200);

    // TEMPORARY: verify whether this is an async timing issue
    await waitForAudit(pool);

    let result = await pool.query("SELECT * FROM public.audit_logs");

    expect(result.rowCount).toBe(1);

    await truncateAuditTable(pool);

    await request(app).get("/health").expect(200);

    result = await pool.query("SELECT * FROM public.audit_logs");

    expect(result.rowCount).toBe(0);
  });
});
