import { describe, expect, it } from "vitest";

import { createTableQuery } from "../queries/create-table";

describe("createTableQuery", () => {
  it("creates the schema if it does not exist", () => {
    const query = createTableQuery("public", "audit_logs");

    expect(query).toContain("CREATE SCHEMA IF NOT EXISTS public;");
  });

  it("creates the pgcrypto extension", () => {
    const query = createTableQuery("public", "audit_logs");

    expect(query).toContain("CREATE EXTENSION IF NOT EXISTS pgcrypto;");
  });

  it("creates the audit table", () => {
    const query = createTableQuery("public", "audit_logs");

    expect(query).toContain("CREATE TABLE IF NOT EXISTS public.audit_logs");
  });

  it("creates all required columns", () => {
    const query = createTableQuery("public", "audit_logs");

    expect(query).toContain("id UUID PRIMARY KEY");
    expect(query).toContain("timestamp TIMESTAMPTZ NOT NULL");
    expect(query).toContain("action VARCHAR(100) NOT NULL");
    expect(query).toContain("actor JSONB");
    expect(query).toContain("resource JSONB NOT NULL");
    expect(query).toContain("request JSONB");
    expect(query).toContain("before_state JSONB");
    expect(query).toContain("after_state JSONB");
    expect(query).toContain("metadata JSONB");
    expect(query).toContain("status VARCHAR(20) NOT NULL");
    expect(query).toContain("created_at TIMESTAMPTZ NOT NULL");
  });

  it("uses the provided schema and table names", () => {
    const query = createTableQuery("audit", "events");

    expect(query).toContain("CREATE TABLE IF NOT EXISTS audit.events");
  });

  it("rejects invalid schema names", () => {
    expect(() => createTableQuery("public;", "audit_logs")).toThrow();
  });

  it("rejects invalid table names", () => {
    expect(() => createTableQuery("public", "audit_logs;")).toThrow();
  });
});
