import { describe, expect, it, vi } from "vitest";

import { AuditAction, AuditStatus, type AuditEvent } from "@auditx/contracts";

import { AuditEngine } from "../engine/AuditEngine";

function createEvent(): AuditEvent {
  return {
    timestamp: new Date(),

    action: AuditAction.CREATE,

    resource: {
      type: "User",
      id: "123",
    },

    request: {
      method: "POST",
      endpoint: "/users",
    },

    status: AuditStatus.SUCCESS,
  };
}

describe("AuditEngine", () => {
  it("persists the audit event using every configured adapter", async () => {
    const persist1 = vi.fn().mockResolvedValue(undefined);
    const persist2 = vi.fn().mockResolvedValue(undefined);

    const engine = new AuditEngine({
      application: {
        name: "auditx-test",
      },
      adapters: [{ persist: persist1 }, { persist: persist2 }],
    });

    const event = createEvent();

    await engine.log(event);

    expect(persist1).toHaveBeenCalledOnce();
    expect(persist2).toHaveBeenCalledOnce();
  });

  it("enriches every event with application metadata", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);

    const engine = new AuditEngine({
      application: {
        name: "auditx",
        version: "1.0.0",
        environment: "test",
      },
      adapters: [{ persist }],
    });

    await engine.log(createEvent());

    expect(persist).toHaveBeenCalledOnce();

    const persistedEvent = persist.mock.calls[0]?.[0] as AuditEvent;

    expect(persistedEvent.metadata).toEqual({
      application: {
        name: "auditx",
        version: "1.0.0",
        environment: "test",
      },
    });
  });

  it("preserves existing metadata when enriching the event", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);

    const engine = new AuditEngine({
      application: {
        name: "auditx",
      },
      adapters: [{ persist }],
    });

    const event = createEvent();

    event.metadata = {
      module: "Users",
    };

    await engine.log(event);

    expect(persist).toHaveBeenCalledOnce();

    const persistedEvent = persist.mock.calls[0]?.[0] as AuditEvent;

    expect(persistedEvent.metadata).toEqual({
      module: "Users",
      application: {
        name: "auditx",
        version: undefined,
        environment: undefined,
      },
    });
  });

  it("does not mutate the original audit event", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);

    const engine = new AuditEngine({
      application: {
        name: "auditx",
      },
      adapters: [{ persist }],
    });

    const event = createEvent();

    await engine.log(event);

    expect(event.metadata).toBeUndefined();
  });
});
