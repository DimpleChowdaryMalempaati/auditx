import { describe, expect, it, vi } from "vitest";

import {
  AuditAction,
  AuditStatus,
  type AuditEvent,
  type TransportContext,
} from "@auditx/contracts";

import { AuditX } from "../AuditX";

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

function createContext(): TransportContext {
  return {
    request: {
      method: "POST",
      endpoint: "/users",
      requestId: "req-1",
    },
    response: {
      statusCode: 201,
      duration: 10,
    },
  };
}

describe("AuditX", () => {
  it("logs audit events", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);

    const audit = new AuditX({
      application: {
        name: "auditx",
      },
      adapters: [
        {
          persist,
        },
      ],
    });

    await audit.log(createEvent());

    expect(persist).toHaveBeenCalledOnce();
  });

  it("captures transport contexts", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);

    const audit = new AuditX({
      application: {
        name: "auditx",
      },
      adapters: [
        {
          persist,
        },
      ],
    });

    await audit.capture(createContext());

    expect(persist).toHaveBeenCalledOnce();
  });

  it("maps transport contexts before persisting", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);

    const audit = new AuditX({
      application: {
        name: "auditx",
      },
      adapters: [
        {
          persist,
        },
      ],
    });

    await audit.capture(createContext());

    const event = persist.mock.calls[0]?.[0] as AuditEvent;

    expect(event.action).toBe(AuditAction.CREATE);

    expect(event.status).toBe(AuditStatus.SUCCESS);

    expect(event.request).toBeDefined();
    expect(event.request!.endpoint).toBe("/users");
  });

  it("enriches events with application metadata", async () => {
    const persist = vi.fn().mockResolvedValue(undefined);

    const audit = new AuditX({
      application: {
        name: "auditx",
        version: "1.0.0",
        environment: "test",
      },
      adapters: [
        {
          persist,
        },
      ],
    });

    await audit.capture(createContext());

    const event = persist.mock.calls[0]?.[0] as AuditEvent;

    expect(event.metadata).toEqual({
      application: {
        name: "auditx",
        version: "1.0.0",
        environment: "test",
      },
    });
  });
});
