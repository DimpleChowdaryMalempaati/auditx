import { describe, expect, it } from "vitest";
import type { Request, Response } from "express";

import { AuditAction } from "@auditx/contracts";

import { RequestAuditBuilder } from "../audit/RequestAuditBuilder";
import { TransportContextBuilder } from "../builders/TransportContextBuilder";

describe("TransportContextBuilder", () => {
  const builder = new TransportContextBuilder();

  function createRequest(): Request {
    const audit = new RequestAuditBuilder();

    audit
      .action(AuditAction.UPDATE)
      .resource({
        type: "User",
        id: "123",
      })
      .metadata({
        module: "Users",
      });

    return {
      method: "PATCH",
      originalUrl: "/users/123",
      ip: "127.0.0.1",
      headers: {
        authorization: "Bearer token",
      },
      query: {
        active: true,
      },
      params: {
        id: "123",
      },
      body: {
        name: "Jane",
      },
      audit,
      get(name: string) {
        switch (name.toLowerCase()) {
          case "user-agent":
            return "Vitest";

          case "x-request-id":
            return "request-123";

          default:
            return undefined;
        }
      },
    } as unknown as Request;
  }

  function createResponse(): Response {
    return {
      statusCode: 200,
    } as Response;
  }

  it("builds a complete transport context", () => {
    const context = builder.build(createRequest(), createResponse(), 150, {
      id: "user-1",
      email: "john@example.com",
    });

    expect(context).toEqual({
      request: {
        method: "PATCH",
        endpoint: "/users/123",
        ip: "127.0.0.1",
        userAgent: "Vitest",
        requestId: "request-123",
        headers: {
          authorization: "Bearer token",
        },
        query: {
          active: true,
        },
        params: {
          id: "123",
        },
        body: {
          name: "Jane",
        },
      },
      response: {
        statusCode: 200,
        duration: 150,
      },
      actor: {
        id: "user-1",
        email: "john@example.com",
      },
      auditContext: {
        action: AuditAction.UPDATE,
        resource: {
          type: "User",
          id: "123",
        },
        metadata: {
          module: "Users",
        },
      },
    });
  });

  it("supports requests without an actor", () => {
    const context = builder.build(createRequest(), createResponse(), 25);

    expect(context.actor).toBeUndefined();
  });

  it("returns undefined for missing headers", () => {
    const request = createRequest();

    request.get = () => undefined;

    const context = builder.build(request, createResponse(), 10);

    expect(context.request.userAgent).toBeUndefined();
    expect(context.request.requestId).toBeUndefined();
  });

  it("includes an empty audit context when no enrichment is provided", () => {
    const request = createRequest();

    request.audit = new RequestAuditBuilder();

    const context = builder.build(request, createResponse(), 50);

    expect(context.auditContext).toEqual({});
  });
});
