import { describe, expect, it } from "vitest";

import { AuditAction, AuditStatus, type AuditEvent } from "@auditx/contracts";

import { insertAuditQuery } from "../queries/insert-audit";

function createEvent(): AuditEvent {
  return {
    timestamp: new Date("2026-01-01T00:00:00.000Z"),

    action: AuditAction.CREATE,

    actor: {
      id: "1",
      name: "Dimple",
    },

    resource: {
      type: "User",
      id: "123",
    },

    request: {
      method: "POST",
      endpoint: "/users",
    },

    state: {
      before: {
        name: "Old",
      },
      after: {
        name: "New",
      },
    },

    metadata: {
      module: "Users",
    },

    status: AuditStatus.SUCCESS,
  };
}

describe("insertAuditQuery", () => {
  it("builds an INSERT statement for the configured table", () => {
    const query = insertAuditQuery("public", "audit_logs", createEvent());

    expect(query.text).toContain("INSERT INTO public.audit_logs");
  });

  it("creates a parameterized query", () => {
    const query = insertAuditQuery("public", "audit_logs", createEvent());

    expect(query.text).toContain("$1");
    expect(query.text).toContain("$9");
  });

  it("maps the audit event into query values in the correct order", () => {
    const event = createEvent();

    const query = insertAuditQuery("public", "audit_logs", event);

    expect(query.values).toEqual([
      event.timestamp,
      event.action,
      event.actor,
      event.resource,
      event.request,
      event.state?.before,
      event.state?.after,
      event.metadata,
      event.status,
    ]);
  });

  it("stores null for optional fields that are not provided", () => {
    const event: AuditEvent = {
      timestamp: new Date(),

      action: AuditAction.READ,

      resource: {
        type: "User",
      },

      status: AuditStatus.SUCCESS,
    };

    const query = insertAuditQuery("public", "audit_logs", event);

    expect(query.values).toEqual([
      event.timestamp,
      event.action,
      null,
      event.resource,
      null,
      null,
      null,
      null,
      event.status,
    ]);
  });

  it("rejects invalid schema names", () => {
    expect(() =>
      insertAuditQuery("public;", "audit_logs", createEvent()),
    ).toThrow();
  });

  it("rejects invalid table names", () => {
    expect(() =>
      insertAuditQuery("public", "audit_logs;", createEvent()),
    ).toThrow();
  });
});
