import { describe, expect, it, vi } from "vitest";

import type { NextFunction, Request, Response } from "express";

import { AuditMiddleware } from "../middleware/AuditMiddleware";

describe("AuditMiddleware", () => {
  it("attaches request.audit to every request", () => {
    const audit = {
      capture: vi.fn(),
    } as any;

    const middleware = new AuditMiddleware(audit);

    const handler = middleware.handler();

    const request = {
      method: "GET",
      path: "/users",
    } as Request;

    const response = {
      on: vi.fn(),
    } as unknown as Response;

    const next = vi.fn() as NextFunction;

    handler(request, response, next);

    expect(request.audit).toBeDefined();
  });

  it("calls next() for audited requests", () => {
    const audit = {
      capture: vi.fn(),
    } as any;

    const middleware = new AuditMiddleware(audit);

    const handler = middleware.handler();

    const request = {
      method: "GET",
      path: "/users",
    } as Request;

    const response = {
      on: vi.fn(),
    } as unknown as Response;

    const next = vi.fn() as NextFunction;

    handler(request, response, next);

    expect(next).toHaveBeenCalledOnce();
  });

  it("calls next() even when the request is skipped", () => {
    const audit = {
      capture: vi.fn(),
    } as any;

    const middleware = new AuditMiddleware(audit, {
      methods: ["POST"],
    });

    const handler = middleware.handler();

    const request = {
      method: "GET",
      path: "/users",
    } as Request;

    const response = {
      on: vi.fn(),
    } as unknown as Response;

    const next = vi.fn() as NextFunction;

    handler(request, response, next);

    expect(request.audit).toBeDefined();
    expect(next).toHaveBeenCalledOnce();
  });

  it("does not register the finish handler for skipped requests", () => {
    const audit = {
      capture: vi.fn(),
    } as any;

    const middleware = new AuditMiddleware(audit, {
      methods: ["POST"],
    });

    const handler = middleware.handler();

    const request = {
      method: "GET",
      path: "/users",
    } as Request;

    const response = {
      on: vi.fn(),
    } as unknown as Response;

    const next = vi.fn() as NextFunction;

    handler(request, response, next);

    expect(response.on).not.toHaveBeenCalled();
  });

  it("registers the finish handler for audited requests", () => {
    const audit = {
      capture: vi.fn(),
    } as any;

    const middleware = new AuditMiddleware(audit);

    const handler = middleware.handler();

    const request = {
      method: "GET",
      path: "/users",
    } as Request;

    const response = {
      on: vi.fn(),
    } as unknown as Response;

    const next = vi.fn() as NextFunction;

    handler(request, response, next);

    expect(response.on).toHaveBeenCalledOnce();
  });
});
