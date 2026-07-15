import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { Pool } from "pg";

import { AuditAction, AuditStatus, type AuditEvent } from "@auditx/contracts";

import { PostgresAdapter } from "../PostgresAdapter";

describe("PostgresAdapter Integration", () => {
  const pool = new Pool({
    host: "localhost",
    port: 5460,
    database: "auditx",
    user: "postgres",
    password: "postgres",
  });

  const adapter = new PostgresAdapter({
    pool,
    schema: "public",
    table: "audit_logs",
  });

  beforeAll(async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.audit_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        timestamp TIMESTAMPTZ NOT NULL,
        action VARCHAR(100) NOT NULL,
        actor JSONB,
        resource JSONB NOT NULL,
        request JSONB,
        before_state JSONB,
        after_state JSONB,
        metadata JSONB,
        status VARCHAR(20) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
  });

  beforeEach(async () => {
    await pool.query("TRUNCATE TABLE public.audit_logs RESTART IDENTITY;");
  });

  afterAll(async () => {
    await pool.end();
  });

  it("persists an audit event", async () => {
    const event: AuditEvent = {
      timestamp: new Date(),

      action: AuditAction.CREATE,

      resource: {
        type: "User",
        id: "123",
      },

      actor: {
        id: "user-1",
        email: "john@example.com",
      },

      request: {
        method: "POST",
        endpoint: "/users",
      },

      metadata: {
        module: "Users",
      },

      status: AuditStatus.SUCCESS,
    };

    await adapter.persist(event);

    const result = await pool.query(`
      SELECT *
      FROM public.audit_logs
    `);

    expect(result.rowCount).toBe(1);

    const row = result.rows[0];

    expect(row.action).toBe("CREATE");

    expect(row.status).toBe("SUCCESS");

    expect(row.resource).toEqual({
      type: "User",
      id: "123",
    });

    expect(row.actor).toEqual({
      id: "user-1",
      email: "john@example.com",
    });

    expect(row.request).toEqual({
      method: "POST",
      endpoint: "/users",
    });

    expect(row.metadata).toEqual({
      module: "Users",
    });
  });
});
