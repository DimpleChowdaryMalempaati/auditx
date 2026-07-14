import { describe, expect, it } from "vitest";

import type { Request } from "express";

import { shouldAudit } from "../middleware/should-audit";

function createRequest(method: string, path: string): Request {
  return {
    method,
    path,
  } as Request;
}

describe("shouldAudit", () => {
  it("returns true when no options are provided", () => {
    const request = createRequest("GET", "/users");

    expect(shouldAudit(request, {})).toBe(true);
  });

  it("allows configured HTTP methods", () => {
    const request = createRequest("POST", "/users");

    expect(
      shouldAudit(request, {
        methods: ["POST", "PATCH"],
      }),
    ).toBe(true);
  });

  it("rejects methods that are not configured", () => {
    const request = createRequest("GET", "/users");

    expect(
      shouldAudit(request, {
        methods: ["POST", "PATCH"],
      }),
    ).toBe(false);
  });

  it("matches methods case-insensitively", () => {
    const request = createRequest("POST", "/users");

    expect(
      shouldAudit(request, {
        methods: ["post"],
      }),
    ).toBe(true);
  });

  it("includes matching routes", () => {
    const request = createRequest("POST", "/users");

    expect(
      shouldAudit(request, {
        include: ["/users"],
      }),
    ).toBe(true);
  });

  it("includes nested routes", () => {
    const request = createRequest("PATCH", "/users/123");

    expect(
      shouldAudit(request, {
        include: ["/users"],
      }),
    ).toBe(true);
  });

  it("rejects routes that are not included", () => {
    const request = createRequest("POST", "/orders");

    expect(
      shouldAudit(request, {
        include: ["/users"],
      }),
    ).toBe(false);
  });

  it("excludes configured routes", () => {
    const request = createRequest("GET", "/health");

    expect(
      shouldAudit(request, {
        exclude: ["/health"],
      }),
    ).toBe(false);
  });

  it("excludes nested routes", () => {
    const request = createRequest("GET", "/health/live");

    expect(
      shouldAudit(request, {
        exclude: ["/health"],
      }),
    ).toBe(false);
  });

  it("gives exclude precedence over include", () => {
    const request = createRequest("GET", "/users");

    expect(
      shouldAudit(request, {
        include: ["/users"],
        exclude: ["/users"],
      }),
    ).toBe(false);
  });

  it("matches the root route exactly", () => {
    const request = createRequest("GET", "/");

    expect(
      shouldAudit(request, {
        exclude: ["/"],
      }),
    ).toBe(false);
  });

  it("does not match root against nested routes", () => {
    const request = createRequest("GET", "/users");

    expect(
      shouldAudit(request, {
        exclude: ["/"],
      }),
    ).toBe(true);
  });
});
