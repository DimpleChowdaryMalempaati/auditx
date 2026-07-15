import { describe, expect, it } from "vitest";

import {
  AuditAction,
  AuditStatus,
  type TransportContext,
} from "@auditx/contracts";

import { AuditEventMapper } from "../engine/AuditEventMapper";

function createContext(): TransportContext {
  return {
    request: {
      method: "GET",
      endpoint: "/users",
      ip: "127.0.0.1",
      userAgent: "Vitest",
      requestId: "req-123",
    },
    response: {
      statusCode: 200,
      duration: 42,
    },
  };
}

describe("AuditEventMapper", () => {
  it("maps GET requests to READ", () => {
    const mapper = new AuditEventMapper();

    const event = mapper.map(createContext());

    expect(event.action).toBe(AuditAction.READ);
  });

  it("maps POST requests to CREATE", () => {
    const mapper = new AuditEventMapper();

    const context = createContext();
    context.request.method = "POST";

    const event = mapper.map(context);

    expect(event.action).toBe(AuditAction.CREATE);
  });

  it("maps PATCH requests to UPDATE", () => {
    const mapper = new AuditEventMapper();

    const context = createContext();
    context.request.method = "PATCH";

    const event = mapper.map(context);

    expect(event.action).toBe(AuditAction.UPDATE);
  });

  it("maps DELETE requests to DELETE", () => {
    const mapper = new AuditEventMapper();

    const context = createContext();
    context.request.method = "DELETE";

    const event = mapper.map(context);

    expect(event.action).toBe(AuditAction.DELETE);
  });

  it("prefers the explicit audit action over the inferred action", () => {
    const mapper = new AuditEventMapper();

    const context = createContext();

    context.request.method = "POST";

    context.auditContext = {
      action: AuditAction.LOGIN,
    };

    const event = mapper.map(context);

    expect(event.action).toBe(AuditAction.LOGIN);
  });

  it("uses the audit resource when provided", () => {
    const mapper = new AuditEventMapper();

    const context = createContext();

    context.auditContext = {
      resource: {
        type: "User",
        id: "123",
      },
    };

    const event = mapper.map(context);

    expect(event.resource).toEqual({
      type: "User",
      id: "123",
    });
  });

  it("falls back to the endpoint as the resource type", () => {
    const mapper = new AuditEventMapper();

    const event = mapper.map(createContext());

    expect(event.resource).toEqual({
      type: "/users",
    });
  });

  it("maps successful responses to SUCCESS", () => {
    const mapper = new AuditEventMapper();

    const event = mapper.map(createContext());

    expect(event.status).toBe(AuditStatus.SUCCESS);
  });

  it("maps failed responses to FAILED", () => {
    const mapper = new AuditEventMapper();

    const context = createContext();
    context.response.statusCode = 500;

    const event = mapper.map(context);

    expect(event.status).toBe(AuditStatus.FAILED);
  });

  it("copies request, actor, state and metadata into the audit event", () => {
    const mapper = new AuditEventMapper();

    const context = createContext();

    context.actor = {
      id: "1",
      name: "Dimple",
    };

    context.auditContext = {
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
    };

    const event = mapper.map(context);

    expect(event.request).toEqual({
      requestId: "req-123",
      method: "GET",
      endpoint: "/users",
      ip: "127.0.0.1",
      userAgent: "Vitest",
    });

    expect(event.actor).toEqual(context.actor);

    expect(event.state).toEqual(context.auditContext.state);

    expect(event.metadata).toEqual(context.auditContext.metadata);
  });
});
